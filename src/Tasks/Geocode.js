import L from 'leaflet';
import { Task, Util } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding';

export var Geocode = Task.extend({
  path: 'findAddressCandidates',

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
    'text': 'singleLine',
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
    this.params.searchExtent = Util.boundsToExtent(bounds);
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
      this.params[this.options.customParam] = this.params.singleLine;
      delete this.params.singleLine;
    }

    return this.request(function (error, response) {
      var processor = this._processGeocoderResponse;
      var results = (!error) ? processor(response) : undefined;
      callback.call(context, error, { results: results }, response);
    }, this);
  },

  _processGeocoderResponse: function (response) {
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
