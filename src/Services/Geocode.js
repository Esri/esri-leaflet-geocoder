import { Service } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../EsriLeafletGeocoding';
import geocode from '../Tasks/Geocode';
import reverseGeocode from '../Tasks/ReverseGeocode';
import suggest from '../Tasks/Suggest';

export var GeocodeService = Service.extend({
  initialize: function (options) {
    options = options || {};
    options.url = options.url || WorldGeocodingServiceUrl;
    Service.prototype.initialize.call(this, options);
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
      if (response.capabilities.indexOf('Suggest') > -1) {
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
