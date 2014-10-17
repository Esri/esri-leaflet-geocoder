EsriLeafletGeocoding.Controls.Geosearch.Providers.GeocodeService = EsriLeafletGeocoding.Services.Geocoding.extend({
  options: {
    label: 'Geocode Server',
    maxResults: 5,
    outFields: '*'
  },

  suggestions: function(text, bounds, callback){
    callback(undefined, []);
    return false;
  },

  results: function(text, key, bounds, callback){
    var request = this.geocode().text(text);

    request.maxLocations(this.options.maxResults);

    if(bounds){
      request.within(bounds);
    }

    return request.run(function(error, response){
      callback(error, response.results);
    }, this);
  }
});