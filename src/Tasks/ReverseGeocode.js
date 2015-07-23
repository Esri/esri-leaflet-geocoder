import L from 'leaflet';
import { Task } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding.js';

export var ReverseGeocode = Task.extend({
  path: 'reverseGeocode',

  params: {
    outSR: 4326
  },

  setters: {
    'distance': 'distance',
    'language': 'language'
  },

  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    Task.prototype.initialize.call(this, options);
  },

  latlng: function (latlng) {
    latlng = L.latLng(latlng);
    this.params.location = latlng.lng + ',' + latlng.lat;
    return this;
  },

  run: function (callback, context) {
    return this.request(function (error, response) {
      var result;

      if (!error) {
        result = {
          latlng: new L.LatLng(response.location.y, response.location.x),
          address: response.address
        };
      } else {
        result = undefined;
      }

      callback.call(context, error, result, response);
    }, this);
  }
});

export function reverseGeocode (options) {
  return new ReverseGeocode(options);
}

export default reverseGeocode;
