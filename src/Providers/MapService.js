import { Util, geoJson, latLngBounds } from 'leaflet';
import { MapService } from 'esri-leaflet';

export var MapServiceProvider = MapService.extend({
  options: {
    layers: [0],
    label: 'Map Service',
    bufferRadius: 1000,
    maxResults: 5,
    formatSuggestion: function (feature) {
      return feature.properties[feature.displayFieldName] + ' <small>' + feature.layerName + '</small>';
    }
  },

  initialize: function (options) {
    if (options.apikey) {
      options.token = options.apikey;
    }
    MapService.prototype.initialize.call(this, options);
    this._getIdFields();
  },

  suggestions: function (text, bounds, callback) {
    var request = this.find().text(text).fields(this.options.searchFields).returnGeometry(false).layers(this.options.layers);

    return request.run(function (error, results, raw) {
      var suggestions = [];
      if (!error) {
        var count = Math.min(this.options.maxResults, results.features.length);
        raw.results = raw.results.reverse();
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          var result = raw.results[i];
          var layer = result.layerId;
          var idField = this._idFields[layer];
          feature.layerId = layer;
          feature.layerName = this._layerNames[layer];
          feature.displayFieldName = this._displayFields[layer];
          if (idField) {
            suggestions.push({
              text: this.options.formatSuggestion.call(this, feature),
              unformattedText: feature.properties[feature.displayFieldName],
              magicKey: result.attributes[idField] + ':' + layer
            });
          }
        }
      }
      callback(error, suggestions.reverse());
    }, this);
  },

  results: function (text, key, bounds, callback) {
    var results = [];
    var request;

    if (key && !key.includes(',')) {
      // if there is only 1 key available, use query()
      var featureId = key.split(':')[0];
      var layer = key.split(':')[1];
      request = this.query().layer(layer).featureIds(featureId);
    } else {
      // if there are no keys or more than 1 keys available, use find()
      request = this.find().text(text).fields(this.options.searchFields).layers(this.options.layers);
    }

    return request.run(function (error, features, response) {
      if (!error) {
        if (response.results) {
          response.results = response.results.reverse();
        }
        for (var i = 0; i < features.features.length; i++) {
          var feature = features.features[i];
          layer = layer || response.results[i].layerId;

          if (feature && layer !== undefined) {
            var bounds = this._featureBounds(feature);
            feature.layerId = layer;
            feature.layerName = this._layerNames[layer];
            feature.displayFieldName = this._displayFields[layer];

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
      }
      callback(error, results.reverse());
    }, this);
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
  },

  _layerMetadataCallback: function (layerid) {
    return Util.bind(function (error, metadata) {
      if (error) { return; }
      this._displayFields[layerid] = metadata.displayField;
      this._layerNames[layerid] = metadata.name;
      for (var i = 0; i < metadata.fields.length; i++) {
        var field = metadata.fields[i];
        if (field.type === 'esriFieldTypeOID') {
          this._idFields[layerid] = field.name;
          break;
        }
      }
    }, this);
  },

  _getIdFields: function () {
    this._idFields = {};
    this._displayFields = {};
    this._layerNames = {};
    for (var i = 0; i < this.options.layers.length; i++) {
      var layer = this.options.layers[i];
      this.get(layer, {}, this._layerMetadataCallback(layer));
    }
  }
});

export function mapServiceProvider (options) {
  return new MapServiceProvider(options);
}

export default mapServiceProvider;
