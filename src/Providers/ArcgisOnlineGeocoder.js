L.esri.Controls.Geosearch.Providers.ArcgisOnline = L.esri.Services.Geocoding.extend({
  options: {
    label: "Places and Addresses",
    maxResults: 5
  },
  suggestions: function(map, text, options, callback){
    var request = this.suggest().text(text);

    if(options.useMapBounds === true || (options.useMapBounds <= map.getZoom())){
      request.within(map.getBounds());
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

  results: function(map, text, key, options, callback){
    var request = this.geocode().text(text);

    if(key){
      request.key(key);
    } else {
      request.maxLocations(options.maxResults);
      if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && !options.useMapBounds !== false){
        request.within(map.getBounds());
      }
    }

    if(this.options.forStorage){
      request.forStorage(true);
    }

    return request.run(callback, this);
  }
});

L.esri.Controls.Geosearch.Providers.arcgisOnline = function(options){
  return new L.esri.Controls.Geosearch.Providers.ArcgisOnline(options);
};