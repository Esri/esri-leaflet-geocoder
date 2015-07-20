describe('L.esri.Geocoding.Services.Geocoding', function () {
  var geocoder;

  beforeEach(function(){
    geocoder = new L.esri.Geocoding.Services.GeocodeService();
  });

  it('should initalize with the ArcGIS Online Geocoder URL by default', function(){
    expect(geocoder.options.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/');
  });

  it('should return a new instance of L.esri.Geocoding.Tasks.Geocode', function(){
    var request = geocoder.geocode();
    expect(request).to.be.instanceof(L.esri.Geocoding.Tasks.Geocode);
  });

  it('should return a new instance of L.esri.Geocoding.Tasks.ReverseGeocode', function(){
    var request = geocoder.reverse();
    expect(request).to.be.instanceof(L.esri.Geocoding.Tasks.ReverseGeocode);
  });

  it('should return a new instance of L.esri.Geocoding.Tasks.Suggest', function(){
    var request = geocoder.suggest();
    expect(request).to.be.instanceof(L.esri.Geocoding.Tasks.Suggest);
  });
});
