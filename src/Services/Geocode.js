import { Service } from 'esri-leaflet';
import { WorldGeocodingServiceUrl } from '../helper';
import geocode from '../Tasks/Geocode';
import reverseGeocode from '../Tasks/ReverseGeocode';
import suggest from '../Tasks/Suggest';

export var GeocodeService = Service.extend({
  initialize: function (options) {
    options = options || {};
    if (options.apikey) {
      options.token = options.apikey;
    }
    if (options.url) {
      Service.prototype.initialize.call(this, options);
      this._confirmSuggestSupport();
    } else {
      options.url = WorldGeocodingServiceUrl;
      options.supportsSuggest = true;
      Service.prototype.initialize.call(this, options);
    }
  },

  geocode: function () {
    return geocode(this);
  },

  reverse: function () {
    return reverseGeocode(this);
  },

  suggest: function () {
    // requires either the Esri World Geocoding Service or a <10.3 ArcGIS Server Geocoding Service that supports suggest.
    return suggest(this);
  },

  _confirmSuggestSupport: function () {
    this.metadata(function (error, response) {
      if (error) { return; }
      // pre 10.3 geocoding services dont list capabilities (and dont support maxLocations)
      // only SOME individual services have been configured to support asking for suggestions
      if (!response.capabilities) {
        this.options.supportsSuggest = false;
      } else if (response.capabilities.indexOf('Suggest') > -1) {
        this.options.supportsSuggest = true;
      } else {
        this.options.supportsSuggest = false;
      }
      // whether the service supports suggest or not, utilize the metadata response to determine the appropriate parameter name for single line geocoding requests
      this.options.customParam = response.singleLineAddressField.name;
    }, this);
  }
});

export function geocodeService (options) {
  return new GeocodeService(options);
}

export default geocodeService;
