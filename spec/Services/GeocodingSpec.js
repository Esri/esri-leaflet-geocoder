/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.Geocoding.Geocoding', function () {
  var geocoder;

  beforeEach(function () {
    geocoder = new L.esri.Geocoding.GeocodeService();
  });

  it('should initalize with the ArcGIS Online Geocoder URL by default', function () {
    expect(geocoder.options.url).to.contain('//geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/');
  });

  it('should return a new instance of L.esri.Geocoding.Geocode', function () {
    var request = geocoder.geocode();
    expect(request).to.be.instanceof(L.esri.Geocoding.Geocode);
  });

  it('should return a new instance of L.esri.Geocoding.ReverseGeocode', function () {
    var request = geocoder.reverse();
    expect(request).to.be.instanceof(L.esri.Geocoding.ReverseGeocode);
  });

  it('should return a new instance of L.esri.Geocoding.Suggest', function () {
    var request = geocoder.suggest();
    expect(request).to.be.instanceof(L.esri.Geocoding.Suggest);
  });
});
/* eslint-disable handle-callback-err */
