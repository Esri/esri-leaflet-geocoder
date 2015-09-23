
describe('L.esri.Geosearch', function () {

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

});
