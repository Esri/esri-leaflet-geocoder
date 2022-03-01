/* eslint-env mocha */
/* eslint-disable handle-callback-err */
describe('L.esri.Suggest', function () {
  var sampleResponse = JSON.stringify({
    suggestions: [
      {
        text: 'Treasure Island (Casino), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        magicKey: 'JS91CYhQDS5vDPhvSMyGZby0YFbaMsxIQsNOQNbJCcpaOg8F',
        isCollection: false
      },
      {
        text: 'Treasure Island (Performing Arts), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        magicKey: 'JS91CYhQDS5vDPhvSMyGZby0YFbaUBoGQDkaQ1baCcpaOg8F',
        isCollection: false
      },
      {
        text: 'Treasure Island (Tourist Attraction), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        magicKey: 'JS91CYhQDS5vDPhvSMyGZby0YFbAQBwEU5gEMNbACcpaOg8F',
        isCollection: false
      },
      {
        text: 'Treasure Island-Parking Entrance, Mel Torme Way, Las Vegas, Nevada',
        magicKey: 'JS91CYhQDS5vDPhvSMyGZby0YFbOQDVJQsxKCDkuZc50HoFF',
        isCollection: false
      },
      {
        text: 'Treasure Island-Las Vegas, 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        magicKey: 'JS91CYhQDS5vDPhvSMyGZby0YFbAQDNKU5gKUNb7CcpaOg8F',
        isCollection: false
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

  it('should make a suggest request to ArcGIS Online', function (done) {
    var request = L.esri.Geocoding.suggest().text('trea').run(function (error, response) {
      expect(response.suggestions.length).to.equal(5);
      done();
    });

    expect(request.url).to.contain('//geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest');
    expect(request.url).to.contain('text=trea');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should make a suggest request with a nearby filter', function (done) {
    var request = L.esri.Geocoding.suggest().text('trea').nearby([45, -121], 5000).run(function (error, response) {
      expect(response.suggestions.length).to.equal(5);
      done();
    });

    expect(request.url).to.contain('location=-121%2C45');
    expect(request.url).to.contain('distance=5000');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should make a suggest request with a bounds filter', function (done) {
    var request = L.esri.Geocoding.suggest().text('trea').within([[0, 0], [100, 100]]).run(function (error, response) {
      expect(response.suggestions.length).to.equal(5);
      done();
    });

    expect(request.url).to.contain('location=50%2C50');
    expect(request.url).to.contain('distance=50000');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should pass along a country in requests correctly', function (done) {
    var request = L.esri.Geocoding.suggest().text('trea').countries('GUM').run(function (error, response) {
      expect(response.suggestions.length).to.equal(5);
      done();
    });

    expect(request.url).to.contain('countryCode=GUM');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });

  it('should pass along more than one country from an array correctly too', function (done) {
    var request = L.esri.Geocoding.suggest().text('trea').countries(['USA', 'GUM']).run(function (error, response) {
      expect(response.suggestions.length).to.equal(5);
      done();
    });

    expect(request.url).to.contain('countryCode=USA%2CGUM');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleResponse);
  });
});
/* eslint-disable handle-callback-err */
