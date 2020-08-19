/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('Providers.GeocodeService', function () {
  var xhr;
  var provider;

  beforeEach(function () {
    xhr = sinon.useFakeXMLHttpRequest();
    provider = L.esri.Geocoding.geocodeServiceProvider({
      url: 'http://example.com/arcgis/arcgis/rest/services/MockGeocodeService'
    });
  });

  afterEach(function () {
    xhr.restore();
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

  it('should geocode for partial text', function (done) {
    var request = provider.results('380 New York St, Redlands', null, null, function (error, results) {
      expect(results[0].latlng.lat).to.equal(34.056490727765947);
      expect(results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(results[0].score).to.equal(100);
      expect(results[0].properties.Addr_type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockGeocodeService');
    expect(request.url).to.contain('singleLine=380%20New%20York%20St%2C%20Redlands');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });

  it('pass a token through', function (done) {
    provider = L.esri.Geocoding.geocodeServiceProvider({
      url: 'http://example.com/arcgis/arcgis/rest/services/MockGeocodeService',
      token: 'abc123'
    });
    var request = provider.results('380 New York St, Redlands', null, null, function (error, results) {
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockGeocodeService');
    expect(request.url).to.contain('singleLine=380%20New%20York%20St%2C%20Redlands');
    expect(request.url).to.contain('token=abc123');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });

  it('pass an apikey through', function (done) {
    provider = L.esri.Geocoding.geocodeServiceProvider({
      url: 'http://example.com/arcgis/arcgis/rest/services/MockGeocodeService',
      apikey: 'abc123'
    });

    var request = provider.results('380 New York St, Redlands', null, null, function (error, results) {
      done();
    });

    expect(request.url).to.contain('http://example.com/arcgis/arcgis/rest/services/MockGeocodeService');
    expect(request.url).to.contain('singleLine=380%20New%20York%20St%2C%20Redlands');
    expect(request.url).to.contain('token=abc123');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, samplefindAddressCandidatesResponse);
  });
});
/* eslint-disable handle-callback-err */
