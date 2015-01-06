EsriLeafletGeocoding.Services.Geocoding = Esri.Services.Service.extend({

  includes: L.Mixin.Events,

  initialize: function(options){
    options = options || {};
    options.url = options.url || EsriLeafletGeocoding.WorldGeocodingService;
    Esri.Services.Service.prototype.initialize.call(this, options);
  },

  geocode: function(){
    return new EsriLeafletGeocoding.Tasks.Geocode(this);
  },

  reverse: function(){
    return new EsriLeafletGeocoding.Tasks.ReverseGeocode(this);
  },

  suggest: function(){
    if(this.options.url !== EsriLeafletGeocoding.WorldGeocodingService && console && console.warn){
      console.warn('Only the ArcGIS Online World Geocoder supports suggestions');
      return;
    }
    return new EsriLeafletGeocoding.Tasks.Suggest(this);
  }
});

EsriLeafletGeocoding.Services.geocoding = function(options){
  return new EsriLeafletGeocoding.Services.Geocoding(options);
};