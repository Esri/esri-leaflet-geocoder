import { Util, geoJson, latLngBounds } from 'leaflet';
import { FeatureLayerService } from 'esri-leaflet';

export var FeatureLayerProvider = FeatureLayerService.extend({
  options: {
    label: 'Feature Layer',
    maxResults: 5,
    bufferRadius: 1000,
    searchMode: 'contain',
    formatSuggestion: function (feature) {
      return feature.properties[this.options.searchFields[0]];
    }
  },

  initialize: function (options) {
    if (options.apikey) {
      options.token = options.apikey;
    }
    FeatureLayerService.prototype.initialize.call(this, options);
    if (typeof this.options.searchFields === 'string') {
      this.options.searchFields = [this.options.searchFields];
    }
    this._suggestionsQuery = this.query();
    this._resultsQuery = this.query();
  },

  suggestions: function (text, bounds, callback) {
    var query = this._suggestionsQuery.where(this._buildQuery(text))
      .returnGeometry(false);

    if (bounds) {
      query.intersects(bounds);
    }

    if (this.options.idField) {
      query.fields([this.options.idField].concat(this.options.searchFields));
    }

    var request = query.run(function (error, results, raw) {
      if (error) {
        callback(error, []);
      } else {
        this.options.idField = raw.objectIdFieldName;
        var suggestions = [];
        for (var i = results.features.length - 1; i >= 0; i--) {
          var feature = results.features[i];
          suggestions.push({
            text: this.options.formatSuggestion.call(this, feature),
            unformattedText: feature.properties[this.options.searchFields[0]],
            magicKey: feature.id
          });
        }
        callback(error, suggestions.slice(0, this.options.maxResults));
      }
    }, this);

    return request;
  },

  results: function (text, key, bounds, callback) {
    var query = this._resultsQuery;

    if (key) {
      // if there are 1 or more keys available, use query.featureIds()
      delete query.params.where;
      query.featureIds([key]);
    } else {
      // if there are no keys available, use query.where()
      query.where(this._buildQuery(text));
    }

    if (bounds) {
      query.within(bounds);
    }

    return query.run(Util.bind(function (error, features) {
      var results = [];
      for (var i = 0; i < features.features.length; i++) {
        var feature = features.features[i];
        if (feature) {
          var bounds = this._featureBounds(feature);

          var result = {
            latlng: bounds.getCenter(),
            bounds: bounds,
            text: this.options.formatSuggestion.call(this, feature),
            properties: feature.properties,
            geojson: feature
          };

          results.push(result);

          // clear query parameters for the next search
          delete this._resultsQuery.params['objectIds'];
        }
      }
      callback(error, results);
    }, this));
  },

  orderBy: function (fieldName, order) {
    this._suggestionsQuery.orderBy(fieldName, order);
  },

  _buildQuery: function (text) {
    var queryString = [];

    for (var i = this.options.searchFields.length - 1; i >= 0; i--) {
      var field = 'upper("' + this.options.searchFields[i] + '")';
      if (this.options.searchMode === 'contain') {
        queryString.push(field + " LIKE upper('%" + text + "%')");
      } else if (this.options.searchMode === 'startWith') {
        queryString.push(field + " LIKE upper('" + text + "%')");
      } else if (this.options.searchMode === 'endWith') {
        queryString.push(field + " LIKE upper('%" + text + "')");
      } else if (this.options.searchMode === 'strict') {
        queryString.push(field + " LIKE upper('" + text + "')");
      } else {
        throw new Error('L.esri.Geocoding.featureLayerProvider: Invalid parameter for "searchMode". Use one of "contain", "startWith", "endWith", or "strict"');
      }
    }
    if (this.options.where) {
      return this.options.where + ' AND (' + queryString.join(' OR ') + ')';
    } else {
      return queryString.join(' OR ');
    }
  },

  _featureBounds: function (feature) {
    var geojson = geoJson(feature);
    if (feature.geometry.type === 'Point') {
      var center = geojson.getBounds().getCenter();
      var lngRadius = ((this.options.bufferRadius / 40075017) * 360) / Math.cos((180 / Math.PI) * center.lat);
      var latRadius = (this.options.bufferRadius / 40075017) * 360;
      return latLngBounds([center.lat - latRadius, center.lng - lngRadius], [center.lat + latRadius, center.lng + lngRadius]);
    } else {
      return geojson.getBounds();
    }
  }
});

export function featureLayerProvider (options) {
  return new FeatureLayerProvider(options);
}

export default featureLayerProvider;
