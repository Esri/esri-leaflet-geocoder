EsriLeafletGeocoding.Services.Geocoding = Esri.Services.Service.extend({

  includes: L.Mixin.Events,

  initialize: function(options){
    options = options || {};
    options.url = options.url || EsriLeafletGeocoding.WorldGeocodingService;
    Esri.Services.Service.prototype.initialize.call(this, options);
    this._confirmSuggestSupport();
  },

  geocode: function(){
    return new EsriLeafletGeocoding.Tasks.Geocode(this);
  },

  reverse: function(){
    return new EsriLeafletGeocoding.Tasks.ReverseGeocode(this);
  },

  suggest: function(){
    // requires either the Esri World Geocoding Service or a 10.3 ArcGIS Server Geocoding Service that supports suggest.
    return new EsriLeafletGeocoding.Tasks.Suggest(this);
  },

  _confirmSuggestSupport: function(){
    this.metadata(function(error, response) {
      if (response.capabilities.includes('Suggest')) {
        this.options.supportsSuggest = true;
      }
      else {
        this.options.supportsSuggest = false;
      }
    }, this);
  }
});

EsriLeafletGeocoding.Services.geocoding = function(options){
  return new EsriLeafletGeocoding.Services.Geocoding(options);
};