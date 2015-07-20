import L from 'leaflet';
import { Task, Util } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding.js';

// becuse esri-leaflet was ignored from the build AND we want
// to support custom builds remap the imports from esri-leaflet
// if they are undefined to the globals
var _Task = (typeof Task === 'undefined') ? L.esri.Tasks.Task : Task;
var _Util = (typeof Util === 'undefined') ? L.esri.Util : Util;

export var Suggest = _Task.extend({
  path: 'suggest',

  params: {},

  setters: {
    text: 'text',
    category: 'category'
  },

  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    _Task.prototype.initialize.call(this, options);
  },

  within: function (bounds) {
    bounds = L.latLngBounds(bounds);
    bounds = bounds.pad(0.5);
    var center = bounds.getCenter();
    var ne = bounds.getNorthWest();
    this.params.location = center.lng + ',' + center.lat;
    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
    this.params.searchExtent = _Util.boundsToExtent(bounds);
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
