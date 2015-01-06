var protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';

var EsriLeafletGeocoding = {
  WorldGeocodingService: protocol + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
  Tasks: {},
  Services: {},
  Controls: {}
};

// attach to the L.esri global if we can
if(typeof window !== 'undefined' && window.L && window.L.esri) {
  window.L.esri.Geocoding = EsriLeafletGeocoding;
}

// We do not have an 'Esri' variable e.g loading this file directly from source define 'Esri'
if(!Esri){
  var Esri = window.L.esri;
}