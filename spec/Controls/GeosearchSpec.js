
describe('L.esri.Geosearch', function () {

  function createMap(){
    // create container
    var container = document.createElement('div');

    // give container a width/height
    container.setAttribute('style', 'width:500px; height: 500px;');

    // add contianer to body
    document.body.appendChild(container);

    return L.map(container, {
      minZoom: 1,
      maxZoom: 19
    }).setView([45.51, -122.66], 5);
  }

  var map = createMap();

  beforeEach(function(){
    this.xhr = sinon.useFakeXMLHttpRequest();
    var requests = this.requests = [];

    this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
    };

  });

  afterEach(function(){
    this.xhr.restore();
  });

  var southWest = L.latLng(29.30, -99.71);
  var northEast = L.latLng(31.34, -95.57);
  var mapbounds = L.latLngBounds(southWest, northEast);

  it('shouldnt overwrite custom options set in the constructor', function() {
    var geosearch = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider()
        ],
        useMapBounds: false,
        zoomToResult: false,
        collapseAfterResult: false,
        expanded: true,
        allowMultipleResults: false,
        placeholder: 'something clever',
        title: 'something not so clever',
        searchBounds: mapbounds
    });

    expect(geosearch.options.useMapBounds).to.equal(false);
    expect(geosearch.options.zoomToResult).to.equal(false);
    expect(geosearch.options.collapseAfterResult).to.equal(false);
    expect(geosearch.options.expanded).to.equal(true);
    expect(geosearch.options.allowMultipleResults).to.equal(false);
    expect(geosearch.options.placeholder).to.equal('something clever');
    expect(geosearch.options.title).to.equal('something not so clever');
    expect(geosearch.options.searchBounds).to.equal(mapbounds);
  });


  it('should update map attribution when the World Geocoding Service is used', function() {
    var geosearch = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider()
        ]
    }).addTo(map);

    expect(map.attributionControl._container.innerHTML).to.contain('Geocoding by Esri');
  });

  it('should correctly build the searchExtent for the provider', function (done) {
    var geosearch = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider()
        ],
        searchBounds:mapbounds
    }).addTo(map);

    geosearch._suggest("Mayoworth, WY");
    var request = geosearch._pendingSuggestions[0];
    expect(request).to.be.an.instanceof(XMLHttpRequest);

    this.requests[0].respond(200, { "Content-Type": "application/json" },
                                 JSON.stringify({"suggestions":[]}));

    expect(geosearch._pendingSuggestions[0].url).to.equal('http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?text=Mayoworth%2C%20WY&location=-97.64%2C30.32&distance=50000&searchExtent=%7B%22xmin%22%3A-101.78%2C%22ymin%22%3A28.28%2C%22xmax%22%3A-93.5%2C%22ymax%22%3A32.36%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&f=json');
    done();

  });
});
