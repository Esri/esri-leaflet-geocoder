import L from 'leaflet';
import { Service } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding.js';
import geocode from '../Tasks/Geocode.js';
import reverseGeocode from '../Tasks/ReverseGeocode.js';
import suggest from '../Tasks/Suggest.js';

var _Service = (typeof Service === 'undefined') ? L.esri.Services.Service : Service;

export var GeocodeService = _Service.extend({
  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    _Service.prototype.initialize.call(this, options);
    this._confirmSuggestSupport();
  },

  geocode: function () {
    return geocode(this);
  },

  reverse: function () {
    return reverseGeocode(this);
  },

  suggest: function () {
    // requires either the Esri World Geocoding Service or a 10.3 ArcGIS Server Geocoding Service that supports suggest.
    return suggest(this);
  },

  _confirmSuggestSupport: function () {
    this.metadata(function (error, response) {
      if (error) { return; }
      if (response.capabilities.includes('Suggest')) {
        this.options.supportsSuggest = true;
      } else {
        this.options.supportsSuggest = false;
      }
    }, this);
  }
});

export function geocodeService (options) {
  return new GeocodeService(options);
}

export default geocodeService;
