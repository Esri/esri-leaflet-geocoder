describe('Providers.ArcgisOnline', function () {
  var xhr;
  var provider;

  beforeEach(function(){
    xhr = sinon.useFakeXMLHttpRequest();
    provider = new L.esri.Geocoding.Controls.Geosearch.Providers.ArcGISOnline();
  });

  afterEach(function(){
    xhr.restore();
  });

  var sampleSuggestResponse = JSON.stringify({
    'suggestions': [
      {
        'text': 'Treasure Island (Casino), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        'magicKey': 'JS91CYhQDS5vDPhvSMyGZby0YFbaMsxIQsNOQNbJCcpaOg8F',
        'isCollection': false
      },
      {
        'text': 'Treasure Island (Performing Arts), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        'magicKey': 'JS91CYhQDS5vDPhvSMyGZby0YFbaUBoGQDkaQ1baCcpaOg8F',
        'isCollection': false
      },
      {
        'text': 'Treasure Island (Tourist Attraction), 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        'magicKey': 'JS91CYhQDS5vDPhvSMyGZby0YFbAQBwEU5gEMNbACcpaOg8F',
        'isCollection': false
      },
      {
        'text': 'Treasure Island-Parking Entrance, Mel Torme Way, Las Vegas, Nevada',
        'magicKey': 'JS91CYhQDS5vDPhvSMyGZby0YFbOQDVJQsxKCDkuZc50HoFF',
        'isCollection': false
      },
      {
        'text': 'Treasure Island-Las Vegas, 3300 Las Vegas Blvd S Las Vegas, NV 89109',
        'magicKey': 'JS91CYhQDS5vDPhvSMyGZby0YFbAQDNKU5gKUNb7CcpaOg8F',
        'isCollection': false
      }
    ]
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

  it('should get suggestions based on text', function(done){
    var request = provider.suggestions('trea', null, function(error, results){
      expect(results.length).to.equal(5);
      expect(results[0].text).to.equal('Treasure Island (Casino), 3300 Las Vegas Blvd S Las Vegas, NV 89109');
      expect(results[0].magicKey).to.equal('JS91CYhQDS5vDPhvSMyGZby0YFbaMsxIQsNOQNbJCcpaOg8F');
      done();
    });

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleSuggestResponse);
  });

  it('should use bounds to get suggestions', function(done){
    var request = provider.suggestions('trea', [[0,0],[100,100]], function(error, results){
      done();
    });

    expect(request.url).to.contain('location=50%2C50');
    expect(request.url).to.contain('distance=50000');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleSuggestResponse);
  });

  it('should geocode with a magic key', function(done){
    var request = provider.results('380 New York St, Redlands, California, 92373', 'foo', null, function(error, results){
      expect(results[0].latlng.lat).to.equal(34.056490727765947);
      expect(results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(results[0].score).to.equal(100);
      expect(results[0].properties.Addr_Type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('text=380%20New%20York%20St%2C%20Redlands%2C%20California%2C%2092373');
    expect(request.url).to.contain('magicKey=foo');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

  it('should geocode for partial text', function(done){
    var request = provider.results('380 New York St, Redlands, California, 92373', 'foo', null,  function(error, results){
      expect(results[0].latlng.lat).to.equal(34.056490727765947);
      expect(results[0].latlng.lng).to.equal(-117.19566584280369);
      expect(results[0].text).to.equal('380 New York St, Redlands, California, 92373');
      expect(results[0].score).to.equal(100);
      expect(results[0].properties.Addr_Type).to.equal('PointAddress');
      done();
    });

    expect(request.url).to.contain('text=380%20New%20York%20St%2C%20Redlands%2C%20California%2C%2092373');

    request.respond(200, { 'Content-Type': 'text/plain; charset=utf-8' }, sampleFindResponse);
  });

});