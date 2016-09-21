import L from 'leaflet';
import { FeatureLayerService } from 'esri-leaflet';

export var FeatureLayerProvider = FeatureLayerService.extend({
  options: {
    label: 'Feature Layer',
    maxResults: 5,
    bufferRadius: 1000,
    formatSuggestion: function (feature) {
      return feature.properties[this.options.searchFields[0]];
    }
  },

  initialize: function (options) {
    FeatureLayerService.prototype.initialize.call(this, options);
    if (typeof this.options.searchFields === 'string') {
      this.options.searchFields = [this.options.searchFields];
    }
  },

  suggestions: function (text, bounds, callback) {
    var query = this.query().where(this._buildQuery(text))
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
        var count = Math.min(results.features.length, this.options.maxResults);
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          suggestions.push({
            text: this.options.formatSuggestion.call(this, feature),
            magicKey: feature.id
          });
        }
        callback(error, suggestions.slice(0, this.options.maxResults).reverse());
      }
    }, this);

    return request;
  },

  results: function (text, key, bounds, callback) {
    var query = this.query();

    if (key) {
      query.featureIds([key]);
    } else {
      query.where(this._buildQuery(text));
    }

    if (bounds) {
      query.within(bounds);
    }

    return query.run(L.Util.bind(function (error, features) {
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
        }
      }
      callback(error, results);
    }, this));
  },

  _buildQuery: function (text) {
    var queryString = [];

    for (var i = this.options.searchFields.length - 1; i >= 0; i--) {
      var field = 'upper("' + this.options.searchFields[i] + '")';

      queryString.push(field + " LIKE upper('%" + text + "%')");
    }

    if (this.options.where) {
      return this.options.where + ' AND (' + queryString.join(' OR ') + ')';
    } else {
      return queryString.join(' OR ');
    }
  },

  _featureBounds: function (feature) {
    var geojson = L.geoJson(feature);
    if (feature.geometry.type === 'Point') {
      var center = geojson.getBounds().getCenter();
      var lngRadius = ((this.options.bufferRadius / 40075017) * 360) / Math.cos((180 / Math.PI) * center.lat);
      var latRadius = (this.options.bufferRadius / 40075017) * 360;
      return L.latLngBounds([center.lat - latRadius, center.lng - lngRadius], [center.lat + latRadius, center.lng + lngRadius]);
    } else {
      return geojson.getBounds();
    }
  }
});

export function featureLayerProvider (options) {
  return new FeatureLayerProvider(options);
}

export default featureLayerProvider;
