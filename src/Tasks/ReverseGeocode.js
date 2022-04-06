import { latLng } from 'leaflet';
import { Task } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../helper';

export var ReverseGeocode = Task.extend({
  path: 'reverseGeocode',

  params: {
    outSR: 4326,
    returnIntersection: false
  },

  setters: {
    distance: 'distance',
    language: 'langCode',
    intersection: 'returnIntersection',
    apikey: 'apikey'
  },

  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    Task.prototype.initialize.call(this, options);
  },

  latlng: function (coords) {
    var centroid = latLng(coords);
    this.params.location = centroid.lng + ',' + centroid.lat;
    return this;
  },

  run: function (callback, context) {
    if (this.options.token) {
      this.params.token = this.options.token;
    }
    if (this.options.apikey) {
      this.params.token = this.options.apikey;
    }
    return this.request(function (error, response) {
      var result;

      if (!error) {
        result = {
          latlng: latLng(response.location.y, response.location.x),
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
