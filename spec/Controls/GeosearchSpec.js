
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
        title: 'something not so clever'
    });

    expect(geosearch.options.useMapBounds).to.equal(false);
    expect(geosearch.options.zoomToResult).to.equal(false);
    expect(geosearch.options.collapseAfterResult).to.equal(false);
    expect(geosearch.options.expanded).to.equal(true);
    expect(geosearch.options.allowMultipleResults).to.equal(false);
    expect(geosearch.options.placeholder).to.equal('something clever');
    expect(geosearch.options.title).to.equal('something not so clever');
  });


  it('should update map attribution when the World Geocoding Service is used', function() {
    var geosearch = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider()
        ]
    }).addTo(map);

    expect(map.attributionControl._container.innerHTML).to.contain('Geocoding by Esri');
  });

});
