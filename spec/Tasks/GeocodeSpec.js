describe('L.esri.Geocode', function () {
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

  var samplefindAddressCandidatesResponse = JSON.stringify({
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

  var sampleFindWithinResponse = JSON.stringify({
    'spatialReference': {
      'wkid': 4326,
      'latestWkid': 4326
    },
    'locations': [
      {
        'name': '380 New York St, Redlands, California, 92373',
        'extent': {
          'xmin': -117.196667,
          'ymin': 34.055491,
          'xmax': -117.194667,
          'ymax': 34.057491
        },
        'feature': {
          'geometry': {
            'x': -117.19566602536605,
            'y': 34.056490511029324
          },
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
            'Y': 34.056491,
            'DisplayX': -117.195311,
            'DisplayY': 34.05611,
            'Xmin': -117.196667,
            'Xmax': -117.194667,
            'Ymin': 34.055491,
            'Ymax': 34.057491
          }
        }
      }
    ]
  });

  var sampleFindNearbyResponse = JSON.stringify({
    'spatialReference': {
      'wkid': 4326,
      'latestWkid': 4326
    },
    'locations': [
      {
        'name': 'Highlands Ranch, Colorado, United States',
        'extent': {
          'xmin': -105.053427,
          'ymin': 39.469876,
          'xmax': -104.885427,
          'ymax': 39.637876
        },
        'feature': {
          'geometry': {
            'x': -104.96942569799967,
            'y': 39.55387558400048
          },
          'attributes': {
            'Loc_name': 'Gaz.WorldGazetteer.POI1',
            'Score': 100,
            'Match_addr': 'Highlands Ranch, Colorado, United States',
            'Addr_type': 'POI',
            'Type': 'City',
            'PlaceName': 'Highlands Ranch',
            'Place_addr': '',
            'Phone': '',
            'URL': '',
            'Rank': '8.04',
            'AddBldg': '',
            'AddNum': '',
            'AddNumFrom': '',
            'AddNumTo': '',
            'Side': '',
            'StPreDir': '',
            'StPreType': '',
            'StName': '',
            'StType': '',
            'StDir': '',
            'StAddr': '',
            'Nbrhd': '',
            'City': '',
            'Subregion': 'Douglas',
            'Region': 'Colorado',
            'Postal': '',
            'PostalExt': '',
            'Country': 'USA',
            'LangCode': '',
            'Distance': 349299.97,
            'X': -104.969427,
            'Y': 39.553876,
            'DisplayX': -104.969427,
            'DisplayY': 39.553876,
            'Xmin': -105.053427,
            'Xmax': -104.885427,
            'Ymin': 39.469876,
            'Ymax': 39.637876
          }
        }
      }
    ]
  });

  var xhr;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest();
  });

  afterEach(function () {
    xhr.restore();
  });

  it('should make a basic geocode request to ArcGIS Online', function (done) {
    var request = new L.esri.Geocoding.geocode().text('380 New York St, Redlands, California, 92373').run(function (err, response) {
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

  it('should make a basic find request to a Geocode Service', function (done) {
    var request = new L.esri.Geocoding.geocode({
      url: 'http://gis.example.com/arcgis/rest/services/Geocoder'
    }).text('380 New York St, Redlands, California, 92373').run(function (err, response) {
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

  it('should make a findAddressCandidates request to ArcGIS Online', function (done) {
    var request = new L.esri.Geocoding.geocode().address('380 New York St').city('Redlands').region('California').postal(92373).run(function (err, response) {
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

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });

  it('should make a findAddressCandidates request to a Geocode Service', function (done) {
    var request = new L.esri.Geocoding.geocode({
      url: 'http://gis.example.com/arcgis/rest/services/Geocoder'
    }).address('380 New York St').city('Redlands').region('California').postal(92373).run(function (err, response) {
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

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });

  it('should make a `within` request to ArcGIS Online', function (done) {
    var southWest = L.latLng(34.0500, -117.2000),
      northEast = L.latLng(34.0600, -117.1900),
      bounds = L.latLngBounds(southWest, northEast);

    var request = new L.esri.Geocoding.geocode().text('380 New York St').within(bounds).run(function (err, response) {
      expect(response.results[0].latlng.lat).to.equal(34.056490511029324);
      expect(response.results[0].latlng.lng).to.equal(-117.19566602536605);
      expect(response.results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Region).to.equal('California');
      expect(response.results[0].properties.Addr_type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find');
    expect(request.url).to.contain('text=380%20New%20York%20St');
    expect(request.url).to.contain('bbox=%7B%22xmin%22%3A-117.2%2C%22ymin%22%3A34.05%2C%22xmax%22%3A-117.19%2C%22ymax%22%3A34.06%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindWithinResponse);
  });

  it('should make a `nearby` request to ArcGIS Online', function (done) {
    var denver = L.latLng(37.712, -108.227);

    var request = new L.esri.Geocoding.geocode().text('Highlands Ranch').nearby(denver, 10000).run(function (err, response) {
      expect(response.results[0].latlng.lat).to.equal(39.55387558400048);
      expect(response.results[0].latlng.lng).to.equal(-104.96942569799967);
      expect(response.results[0].text).to.equal('Highlands Ranch, Colorado, United States');
      expect(response.results[0].score).to.equal(100);
      expect(response.results[0].properties.Subregion).to.equal('Douglas');
      expect(response.results[0].properties.Region).to.equal('Colorado');
      expect(response.results[0].properties.Addr_type).to.equal('POI');
      done();
    });

    expect(request.url).to.contain('//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find');
    expect(request.url).to.contain('text=Highlands%20Ranch');
    expect(request.url).to.contain('location=-108.227%2C37.712');
    expect(request.url).to.contain('distance=10000');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindNearbyResponse);
  });

  it('should send the correct params to the right operation for custom geocoding services', function (done) {
    var request = L.esri.Geocoding.geocode({
      url: 'http://tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer',
      customParam: 'SingleLine'
    }).text('Highlands Ranch').run(function (err, response) {
      done();
    });

    expect(request.url).to.contain('//tasks.arcgisonline.com/ArcGIS/rest/services/Locators/TA_Address_NA_10/GeocodeServer/findAddressCandidates');
    expect(request.url).to.contain('SingleLine=Highlands%20Ranch');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });

});
