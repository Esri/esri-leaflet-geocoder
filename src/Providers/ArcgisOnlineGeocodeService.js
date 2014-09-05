L.esri.Controls.Geosearch.Providers.ArcgisOnline = L.esri.Services.Geocoding.extend({
  options: {
    label: "Places and Addresses",
    maxResults: 5
  },
  suggestions: function(map, text, options, callback){
    var params = {};

    if(options.useMapBounds === true || (options.useMapBounds <= map.getZoom())){
      var mapBounds = map.getBounds();
      var center = mapBounds.getCenter();
      var ne = mapBounds.getNorthWest();
      params.location = center.lng + "," + center.lat;
      params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
    }

    return this.suggest(text, params, function(error, response){
      var suggestions = [];
      if(!error){
        while(response.suggestions.length && suggestions.length <= (this.options.maxResults - 1)){
          var suggestion = response.suggestions.shift();
          suggestions.push({
            text: suggestion.text,
            magicKey: suggestion.magicKey
          });
        }
      }
      callback(error, suggestions);
    }, this);
  },
  results: function(map, text, key, options, callback){
    var params = {};

    if(key){
      params.magicKey = key;
    } else {
      params.maxLocations = options.maxResults;
      if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && !options.useMapBounds !== false){
        var mapBounds = map.getBounds();
        var center = mapBounds.getCenter();
        var ne = mapBounds.getNorthWest();
        params.bbox = mapBounds.toBBoxString();
        params.location = center.lng + "," + center.lat;
        params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
      }
    }

    if(this.options.forStorage){
      options.forStorage = true;
    }

    return this.geocode(text, params, callback);
  }
});

L.esri.Controls.Geosearch.Providers.arcgisOnline = function(options){
  return new L.esri.Controls.Geosearch.Providers.ArcgisOnline(options);
};