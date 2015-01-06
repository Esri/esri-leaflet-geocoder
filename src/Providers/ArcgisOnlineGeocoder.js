EsriLeafletGeocoding.Controls.Geosearch.Providers.ArcGISOnline = EsriLeafletGeocoding.Services.Geocoding.extend({
  options: {
    label: 'Places and Addresses',
    maxResults: 5
  },

  suggestions: function(text, bounds, callback){
    var request = this.suggest().text(text);

    if(bounds){
      request.within(bounds);
    }

    return request.run(function(error, results, response){
      var suggestions = [];
      if(!error){
        while(response.suggestions.length && suggestions.length <= (this.options.maxResults - 1)){
          var suggestion = response.suggestions.shift();
          if(!suggestion.isCollection){
            suggestions.push({
              text: suggestion.text,
              magicKey: suggestion.magicKey
            });
          }
        }
      }
      callback(error, suggestions);
    }, this);
  },

  results: function(text, key, bounds, callback){
    var request = this.geocode().text(text);

    if(key){
      request.key(key);
    } else {
      request.maxLocations(this.options.maxResults);
    }

    if(bounds){
      request.within(bounds);
    }

    if(this.options.forStorage){
      request.forStorage(true);
    }

    return request.run(function(error, response){
      callback(error, response.results);
    }, this);
  }
});