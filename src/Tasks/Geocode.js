import L from 'leaflet';
import { Task, Util } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding';

export var Geocode = Task.extend({
  path: 'find',

  params: {
    outSr: 4326,
    forStorage: false,
    outFields: '*',
    maxLocations: 20
  },

  setters: {
    'address': 'address',
    'neighborhood': 'neighborhood',
    'city': 'city',
    'subregion': 'subregion',
    'region': 'region',
    'postal': 'postal',
    'country': 'country',
    'text': 'text',
    'category': 'category',
    'token': 'token',
    'key': 'magicKey',
    'fields': 'outFields',
    'forStorage': 'forStorage',
    'maxLocations': 'maxLocations'
  },

  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    Task.prototype.initialize.call(this, options);
  },

  within: function (bounds) {
    bounds = L.latLngBounds(bounds);
    this.params.bbox = Util.boundsToExtent(bounds);
    return this;
  },

  nearby: function (latlng, radius) {
    latlng = L.latLng(latlng);
    this.params.location = latlng.lng + ',' + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
    return this;
  },

  run: function (callback, context) {
    if (this.options.customParam) {
      this.path = 'findAddressCandidates';
      this.params[this.options.customParam] = this.params.text;
      delete this.params.text;
    } else {
      this.path = (this.params.text) ? 'find' : 'findAddressCandidates';
    }

    if (this.path === 'findAddressCandidates' && this.params.bbox) {
      this.params.searchExtent = this.params.bbox;
      delete this.params.bbox;
    }

    return this.request(function (error, response) {
      var processor = (this.path === 'find') ? this._processFindResponse : this._processFindAddressCandidatesResponse;
      var results = (!error) ? processor(response) : undefined;
      callback.call(context, error, { results: results }, response);
    }, this);
  },

  _processFindResponse: function (response) {
    var results = [];

    for (var i = 0; i < response.locations.length; i++) {
      var location = response.locations[i];
      var bounds;

      if (location.extent) {
        bounds = Util.extentToBounds(location.extent);
      }

      results.push({
        text: location.name,
        bounds: bounds,
        score: location.feature.attributes.Score,
        latlng: L.latLng(location.feature.geometry.y, location.feature.geometry.x),
        properties: location.feature.attributes
      });
    }

    return results;
  },

  _processFindAddressCandidatesResponse: function (response) {
    var results = [];

    for (var i = 0; i < response.candidates.length; i++) {
      var candidate = response.candidates[i];
      if (candidate.extent) {
        var bounds = Util.extentToBounds(candidate.extent);
      }

      results.push({
        text: candidate.address,
        bounds: bounds,
        score: candidate.score,
        latlng: L.latLng(candidate.location.y, candidate.location.x),
        properties: candidate.attributes
      });
    }

    return results;
  }

});

export function geocode (options) {
  return new Geocode(options);
}

export default geocode;
