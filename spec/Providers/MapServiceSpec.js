describe('L.esri.Controls.Geosearch.Providers.MapService', function () {

  var sampleFindResponse = JSON.stringify({
    'results': [
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'OBJECTID': 1,
          'Name': 'Place 1'
        },
        'geometryType': 'esriGeometryPoint',
        'geometry': {
          'x': -122.81,
          'y': 45.48,
          'spatialReference': {
            'wkid': 4326
          }
        }
      },
      {
        'layerId': 0,
        'layerName': 'Features',
        'displayFieldName': 'Name',
        'value': '0',
        'attributes': {
          'OBJECTID': 2,
          'Name': 'Place 2'
        },
        'geometryType': 'esriGeometryPoint',
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

  var sampleQueryResponse = JSON.stringify({
    'fieldAliases': {
      'ObjectID': 'ObjectID',
      'Name': 'Name'
    },
    'fields': [
      {
        'name': 'ObjectID',
        'type': 'esriFieldTypeOID',
        'alias': 'ObjectID'
      },
      {
        'name': 'Name',
        'type': 'esriFieldTypeString',
        'alias': 'Name'
      },
    ],
    'features': [
      {
        'attributes': {
          'ObjectID': 1,
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

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    provider = new L.esri.Geocoding.Controls.Geosearch.Providers.MapService('http://example.com/arcgis/arcgis/rest/services/MockService', {
      searchFields: ['Name']
    });
    provider._idField = 'OBJECTID';
  });

  afterEach(function(){
    xhr.restore();
  });

  it('should get suggestions based on text', function(done){
    var request = provider.suggestions('Pla', null, function(error, results){
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal('Place 1');
      expect(results[0].magicKey).to.equal(1);
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockService/find');
    expect(request.url).to.contain("searchText=Pla");
    expect(request.url).to.contain("searchFields=Name");
    expect(request.url).to.contain("layers=0");

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

  it('should geocode with a magic key', function(done){
    var request = provider.results('Place 1', '1', null, function(error, results){
      expect(results[0].latlng.lat).to.equal(45.48);
      expect(results[0].latlng.lng).to.equal(-122.81);
      expect(results[0].text).to.equal('Place 1');
      done();
    });

    expect(request.url).to.contain('objectIds=1');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleQueryResponse);
  });

  it('should geocode for partial text', function(done){
    var request = provider.results('Pla', null, null, function(error, results){
      expect(results.length).to.equal(2);
      expect(results[0].text).to.equal('Place 1');
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockService/find');
    expect(request.url).to.contain("searchText=Pla");
    expect(request.url).to.contain("searchFields=Name");
    expect(request.url).to.contain("layers=0");

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

});