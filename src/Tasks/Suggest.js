import {
  latLng as LlatLng,
  latLngBounds as LlatLngBounds
} from 'leaflet';
import { Task, Util as EsriUtil } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding';

export var Suggest = Task.extend({
  path: 'suggest',

  params: {},

  setters: {
    text: 'text',
    category: 'category',
    countries: 'countryCode',
    maxSuggestions: 'maxSuggestions'
  },

  initialize: function (options) {
    options = options || {};
    if (!options.url) {
      options.url = WorldGeocodingServiceUrl;
      options.supportsSuggest = true;
    }
    Task.prototype.initialize.call(this, options);
  },

  within: function (bounds) {
    bounds = LlatLngBounds(bounds);
    bounds = bounds.pad(0.5);
    var center = bounds.getCenter();
    var ne = bounds.getNorthWest();
    this.params.location = center.lng + ',' + center.lat;
    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
    this.params.searchExtent = EsriUtil.boundsToExtent(bounds);
    return this;
  },

  nearby: function (latlng, radius) {
    latlng = LlatLng(latlng);
    this.params.location = latlng.lng + ',' + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
    return this;
  },

  run: function (callback, context) {
    if (this.options.supportsSuggest) {
      return this.request(function (error, response) {
        callback.call(context, error, response, response);
      }, this);
    } else {
      console.warn('this geocoding service does not support asking for suggestions');
    }
  }

});

export function suggest (options) {
  return new Suggest(options);
}

export default suggest;
