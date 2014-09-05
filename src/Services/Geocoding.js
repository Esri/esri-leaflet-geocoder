L.esri.Services.Geocoding = L.esri.Services.Service.extend({
  statics: {
    WorldGeocodingService: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
    outFields: 'Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr'
  },
  includes: L.Mixin.Events,
  initialize: function (url, options) {
    url = (typeof url === 'string') ? url : L.esri.Services.Geocoding.WorldGeocodingService;
    options = (typeof url === 'object') ? url : options;
    this.url = L.esri.Util.cleanUrl(url);
    L.Util.setOptions(this, options);
    L.esri.Services.Service.prototype.initialize.call(this, url, options);
  },
  geocode: function(){
    return new L.esri.Tasks.Geocode(this);
  },
  reverse: function(){
    return new L.esri.Tasks.ReverseGeocode(this);
  },
  suggest: function(){
    if(this.url !== L.esri.Services.Geocoding.WorldGeocodingService && console && console.warn){
      console.warn('Only the ArcGIS Online World Geocoder supports suggestions');
    }
    return new L.esri.Tasks.Suggest(this);
  }
});

L.esri.Services.geocoding = function(options){
  return new L.esri.Services.Geocoding(options);
};