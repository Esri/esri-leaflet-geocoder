describe('L.esri.Tasks.Geocode', function () {
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

  var sampleFindAddressCanidatesResponse = JSON.stringify({
    'spatialReference': {
      'wkid': 4326,
      'latestWkid': 4326
    },
    'candidates': [
      {
        'address': '380 New York St, Redlands, California, 92373',
        'location': {
          'x': -117.19566584280369,
          'y': 34.056490727765947
        },
        'score': 100,
        'attributes': {
          'Loc_name': 'USA.PointAddress',
          'Score': 100,
          'Match_addr': '380 New York St, Redlands, California, 92373',
          'Addr_type': 'PointAddress',
          'Type': '',
          'PlaceName': '',
          'Place_addr': '',
          'Phone': '',
          'URL': '',
          'Rank': '',
          'AddBldg': '',
          'AddNum': '380',
          'AddNumFrom': '',
          'AddNumTo': '',
          'Side': 'R',
          'StPreDir': '',
          'StPreType': '',
          'StName': 'New York',
          'StType': 'St',
          'StDir': '',
          'StAddr': '',
          'Nbrhd': '',
          'City': 'Redlands',
          'Subregion': '',
          'Region': 'California',
          'Postal': '92373',
          'PostalExt': '',
          'Country': 'USA',
          'LangCode': 'ENG',
          'Distance': 0,
          'X': -117.195667,
          'Y': 34.056491000000001,
          'DisplayX': -117.195311,
          'DisplayY': 34.056109999999997,
          'Xmin': -117.196701,
          'Xmax': -117.19470099999999,
          'Ymin': 34.055489999999999,
          'Ymax': 34.057490000000001,
          'SubAdmin': '',
          'Admin': ''
        },
        'extent': {
          'xmin': -117.196701,
          'ymin': 34.055489999999999,
          'xmax': -117.19470099999999,
          'ymax': 34.057490000000001
        }
      }
    ]
  });

  var sampleFindLocationsResponse = JSON.stringify({
    "spatialReference": {
      "wkid": 4326,
      "latestWkid": 4326
    },
    "locations": [
      {
        "name": "380 New York St, Redlands, California, 92373",
        "extent": {
          "xmin": -117.196667,
          "ymin": 34.055491,
          "xmax": -117.194667,
          "ymax": 34.057491
        },
        "feature": {
          "geometry": {
            "x": -117.19566602536605,
            "y": 34.056490511029324
          },
          "attributes": {
            "Loc_name": "USA.PointAddress",
            "Score": 100,
            "Match_addr": "380 New York St, Redlands, California, 92373",
            "Addr_type": "PointAddress",
            "Type": "",
            "PlaceName": "",
            "Place_addr": "",
            "Phone": "",
            "URL": "",
            "Rank": "",
            "AddBldg": "",
            "AddNum": "380",
            "AddNumFrom": "",
            "AddNumTo": "",
            "Side": "R",
            "StPreDir": "",
            "StPreType": "",
            "StName": "New York",
            "StType": "St",
            "StDir": "",
            "StAddr": "",
            "Nbrhd": "",
            "City": "Redlands",
            "Subregion": "",
            "Region": "California",
            "Postal": "92373",
            "PostalExt": "",
            "Country": "USA",
            "LangCode": "ENG",
            "Distance": 0,
            "X": -117.195667,
            "Y": 34.056491,
            "DisplayX": -117.195311,
            "DisplayY": 34.05611,
            "Xmin": -117.196667,
            "Xmax": -117.194667,
            "Ymin": 34.055491,
            "Ymax": 34.057491
          }
        }
      }
    ]
  });

  var xhr;

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
  });

  afterEach(function(){
    xhr.restore();
  });

  it('should make a basic geocode request to ArcGIS Online', function(done){
    var request = new L.esri.Geocoding.Tasks.geocode(L.esri.Geocoding.WorldGeocodingService).text('380 New York St, Redlands, California, 92373').run(function(err, response){
      expect(response.results[0].latlng.lat).to.equal(34.056490727765947);
      expect(response.results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Addr_Type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find');
    expect(request.url).to.contain('text=380%20New%20York%20St%2C%20Redlands%2C%20California%2C%2092373');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

  it('should make a basic find request to a Geocode Service', function(done){
    var request = new L.esri.Geocoding.Tasks.geocode('http://gis.example.com/arcgis/rest/services/Geocoder').text('380 New York St, Redlands, California, 92373').run(function(err, response){
      expect(response.results[0].latlng.lat).to.equal(34.056490727765947);
      expect(response.results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Addr_Type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('http://gis.example.com/arcgis/rest/services/Geocoder/find');
    expect(request.url).to.contain('text=380%20New%20York%20St%2C%20Redlands%2C%20California%2C%2092373');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

  it('should make a findAddressCanidates request to ArcGIS Online', function(done){
    var request = new L.esri.Geocoding.Tasks.geocode(L.esri.Geocoding.WorldGeocodingService).address('380 New York St').city('Redlands').region('California').postal(92373).run(function(err, response){
      expect(response.results[0].latlng.lat).to.equal(34.056490727765947);
      expect(response.results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Addr_type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates');
    expect(request.url).to.contain('address=380%20New%20York%20St');
    expect(request.url).to.contain('city=Redlands');
    expect(request.url).to.contain('region=California');
    expect(request.url).to.contain('postal=92373');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindAddressCanidatesResponse);
  });

  it('should make a findAddressCanidates request to a Geocode Service', function(done){
    var request = new L.esri.Geocoding.Tasks.geocode('http://gis.example.com/arcgis/rest/services/Geocoder').address('380 New York St').city('Redlands').region('California').postal(92373).run(function(err, response){
      expect(response.results[0].latlng.lat).to.equal(34.056490727765947);
      expect(response.results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Addr_type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('http://gis.example.com/arcgis/rest/services/Geocoder/findAddressCandidates');
    expect(request.url).to.contain('address=380%20New%20York%20St');
    expect(request.url).to.contain('city=Redlands');
    expect(request.url).to.contain('region=California');
    expect(request.url).to.contain('postal=92373');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindAddressCanidatesResponse);
  });

  it('should make a `within` request to ArcGIS Online', function(done){
    var southWest = L.latLng(34.0500, -117.2000),
        northEast = L.latLng(34.0600, -117.1900),
        bounds = L.latLngBounds(southWest, northEast);
  
    var request = new L.esri.Geocoding.Tasks.geocode(L.esri.Geocoding.WorldGeocodingService).text('380 New York St').within(bounds).run(function(err, response){
      expect(response.results[0].latlng.lat).to.equal(34.056490511029324);
      expect(response.results[0].latlng.lng).to.equal(-117.19566602536605);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Addr_type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find');
    expect(request.url).to.contain('text=380%20New%20York%20St');
    expect(request.url).to.contain('bbox=%7B%22xmin%22%3A-117.2%2C%22ymin%22%3A34.05%2C%22xmax%22%3A-117.19%2C%22ymax%22%3A34.06%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');
    
    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindLocationsResponse);
  });

});