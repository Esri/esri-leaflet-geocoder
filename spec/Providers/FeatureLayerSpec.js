describe('L.esri.Controls.Geosearch.Providers.FeatureLayer', function () {
  var xhr;
  var provider;

  var sampleQueryResponse = {

  }

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    provider = new L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer({
      url: 'http://example.com/arcgis/arcgis/rest/services/MockService/0',
      searchFields: ['Name']
    });
  });

  afterEach(function(){
    xhr.restore();
  });

  var sampleQueryResponse = JSON.stringify({
    'objectIdFieldName': 'FID',
    'fields': [{
      'name': 'Name',
      'type': 'esriFieldTypeString',
      'alias': 'Name',
      'sqlType': 'sqlTypeNVarchar',
      'length': 256,
      'domain': null,
      'defaultValue': null
    },{
      'name': 'FID',
      'type': 'esriFieldTypeOID',
      'alias': 'FID',
      'sqlType': 'sqlTypeInteger',
      'domain': null,
      'defaultValue': null
    }],
    'features': [
      {
        'attributes': {
          'FID': 1,
          'Name': 'Place 1'
        },
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      },
      {
        'attributes': {
          'FID': 2,
          'Name': 'Place 2'
        },
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  });

  var sampleObjectQuery = JSON.stringify({
    'objectIdFieldName': 'FID',
    'fields': [{
      'name': 'Name',
      'type': 'esriFieldTypeString',
      'alias': 'Name',
      'sqlType': 'sqlTypeNVarchar',
      'length': 256,
      'domain': null,
      'defaultValue': null
    },{
      'name': 'FID',
      'type': 'esriFieldTypeOID',
      'alias': 'FID',
      'sqlType': 'sqlTypeInteger',
      'domain': null,
      'defaultValue': null
    }],
    'features': [
      {
        'attributes': {
          'FID': 1,
          'Name': 'Place 1'
        },
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      }
    ]
  });

  it('should get suggestions based on text', function(done){
    var request = provider.suggestions('Pla', null, function(error, results){
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal('Place 1');
      expect(results[0].magicKey).to.equal(1);
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockService/0/query');
    expect(request.url).to.contain("where=Name%20LIKE%20\'%25Pla%25\'");

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleQueryResponse);
  });

  it('should use bounds to get suggestions', function(done){
    var request = provider.suggestions('Pla', L.latLngBounds([[0,0], [100,100]]), function(error, results){
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal('Place 1');
      expect(results[0].magicKey).to.equal(1);
      done();
    });

    expect(request.url).to.contain('geometry=%7B%22xmin%22%3A0%2C%22ymin%22%3A0%2C%22xmax%22%3A100%2C%22ymax%22%3A100%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
    expect(request.url).to.contain('geometryType=esriGeometryEnvelope');
    expect(request.url).to.contain('spatialRel=esriSpatialRelIntersects');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleQueryResponse);
  });

  it('should geocode with a magic key', function(done){
    var request = provider.results('Place 1', '1', null, function(error, results){
      expect(results[0].latlng.lat).to.equal(45.48);
      expect(results[0].latlng.lng).to.equal(-122.81);
      expect(results[0].text).to.equal('Place 1');
      done();
    });

    expect(request.url).to.contain('objectIds=1');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleObjectQuery);
  });

  it('should geocode for partial text', function(done){
    var request = provider.suggestions('Pla', null, function(error, results){
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal('Place 1');
      expect(results[0].magicKey).to.equal(1);
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockService/0/query');
    expect(request.url).to.contain("where=Name%20LIKE%20\'%25Pla%25\'");

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleQueryResponse);
  });

});