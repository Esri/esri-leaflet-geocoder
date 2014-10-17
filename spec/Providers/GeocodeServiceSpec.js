describe('Providers.GeocodeService', function () {
  var xhr;
  var provider;

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    provider = new L.esri.Geocoding.Controls.Geosearch.Providers.GeocodeService('http://example.com/arcgis/arcgis/rest/services/MockGeocodeService');
  });

  afterEach(function(){
    xhr.restore();
  });

  var sampleFindResponse = JSON.stringify({
    'spatialReference': {
      'wkid': 4326,
      'latestWkid': 4326
    },
    'locations': [
      {
        'name': '380 New York St, Redlands, California, 92373',
        'extent': {
          'xmin': -117.196701,
          'ymin': 34.055489999999999,
          'xmax': -117.19470099999999,
          'ymax': 34.057490000000001
        },
        'feature': {
          'geometry': {
            'x': -117.19566584280369,
            'y': 34.056490727765947
          },
          'attributes': {
            'Score': 100,
            'Addr_Type': 'PointAddress'
          }
        }
      }
    ]
  });


  it('should geocode for partial text', function(done){
    var request = provider.results('380 New York St, Redlands', null, null,  function(error, results){
      expect(results[0].latlng.lat).to.equal(34.056490727765947);
      expect(results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(results[0].score).to.equal(100);
      expect(results[0].properties.Addr_Type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockGeocodeService');
    expect(request.url).to.contain('text=380%20New%20York%20St%2C%20Redlands%2C%20California');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

});