describe('L.esri.Tasks.ReverseGeocode', function () {

  var sampleResponse = JSON.stringify({
    'address': {
      'Address': '6 Avenue Gustave Eiffel',
      'Neighborhood': '7e Arrondissement',
      'City': 'Paris',
      'Subregion': 'Paris',
      'Region': 'Île-de-France',
      'Postal': '75007',
      'PostalExt': null,
      'CountryCode': 'FRA',
      'Loc_name': 'FRA.PointAddress'
    },
    'location': {
      'x': 2.2946500041892821,
      'y': 48.857489996304814,
      'spatialReference': {
        'wkid': 4326,
        'latestWkid': 4326
      }
    }
  });

  var sampleFrenchResponse = JSON.stringify({
    'address': {
      'Address': 'Rue de la Sablonnière 16',
      'Neighborhood': 'Bruxelles',
      'City': 'Bruxelles',
      'Subregion': null,
      'Region': null,
      'Postal': '1000',
      'PostalExt': null,
      'CountryCode': 'BEL',
      'Loc_name': 'BEL.StreetAddress'
    },
    'location': {
      'x': 4.3663543042681159,
      'y': 50.851981583549332,
      'spatialReference': {
        'wkid': 4326,
        'latestWkid': 4326
      }
    }
  });

  var xhr;

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
  });

  afterEach(function(){
    xhr.restore();
  });

  it('should make a reverse geocode request to ArcGIS Online', function(done){
    var request = L.esri.Geocoding.Tasks.reverseGeocode().latlng([48.8583,  2.2945]).run(function(error, result, response){
      expect(result.latlng.lat).to.equal(48.857489996304814);
      expect(result.latlng.lng).to.equal(2.2946500041892821);
      expect(result.address.Address).to.equal('6 Avenue Gustave Eiffel');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode');
    expect(request.url).to.contain('location=2.2945%2C48.8583');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should make a reverse geocode request to a Geocode service', function(done){
    var request = L.esri.Geocoding.Tasks.reverseGeocode('http://gis.example.com/arcgis/rest/services/Geocoder').latlng([48.8583,  2.2945]).run(function(error, result, response){
      expect(result.latlng.lat).to.equal(48.857489996304814);
      expect(result.latlng.lng).to.equal(2.2946500041892821);
      expect(result.address.Address).to.equal('6 Avenue Gustave Eiffel');
      done();
    });

    expect(request.url).to.contain('http://gis.example.com/arcgis/rest/services/Geocoder/reverseGeocode');
    expect(request.url).to.contain('location=2.2945%2C48.8583');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should make a reverse geocode request with a distance param', function(done){
    var request = L.esri.Geocoding.Tasks.reverseGeocode().latlng([48.8583,  2.2945]).distance(200).run(function(error, result, response){
      done();
    });

    expect(request.url).to.contain('distance=200');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should make a reverse geocode request with a language param', function(done){
    var request = L.esri.Geocoding.Tasks.reverseGeocode().latlng([48.8583,  2.2945]).language('fr').distance(200).run(function(error, result, response){
      expect(result.address.Address).to.equal('Rue de la Sablonnière 16');
      done();
    });

    expect(request.url).to.contain('language=fr');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFrenchResponse);
  });

});