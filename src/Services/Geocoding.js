EsriLeafletGeocoding.Services.Geocoding = Esri.Services.Service.extend({
  includes: L.Mixin.Events,
  initialize: function (url, options) {
    url = (typeof url === 'string') ? url : EsriLeafletGeocoding.WorldGeocodingService;
    options = (typeof url === 'object') ? url : (options || {});
    this.url = Esri.Util.cleanUrl(url);
    L.Util.setOptions(this, options);
    Esri.Services.Service.prototype.initialize.call(this, url, options);
  },
  geocode: function(){
    return new EsriLeafletGeocoding.Tasks.Geocode(this);
  },
  reverse: function(){
    return new EsriLeafletGeocoding.Tasks.ReverseGeocode(this);
  },
  suggest: function(){
    if(this.url !== EsriLeafletGeocoding.WorldGeocodingService && console && console.warn){
      console.warn('Only the ArcGIS Online World Geocoder supports suggestions');
    }
    return new EsriLeafletGeocoding.Tasks.Suggest(this);
  }
});

EsriLeafletGeocoding.Services.geocoding = function(url, options){
  return new EsriLeafletGeocoding.Services.Geocoding(url, options);
};