import L from 'leaflet';
import { Task, Util } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding';

export var Suggest = Task.extend({
  path: 'suggest',

  params: {},

  setters: {
    text: 'text',
    category: 'category',
    countries: 'countryCode'
  },

  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    Task.prototype.initialize.call(this, options);
  },

  within: function (bounds) {
    bounds = L.latLngBounds(bounds);
    bounds = bounds.pad(0.5);
    var center = bounds.getCenter();
    var ne = bounds.getNorthWest();
    this.params.location = center.lng + ',' + center.lat;
    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
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
    return this.request(function (error, response) {
      callback.call(context, error, response, response);
    }, this);
  }

});

export function suggest (options) {
  return new Suggest(options);
}

export default suggest;
