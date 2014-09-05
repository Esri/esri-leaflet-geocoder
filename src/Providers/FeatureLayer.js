L.esri.Controls.Geosearch.Providers.FeatureLayer = L.esri.Services.FeatureLayer.extend({
  options: {
    label: 'Feature Layer',
    maxResults: 5
  },
  suggestions: function(map, text, options, callback){
    var query = this.query().where(this.options.searchField + " LIKE '%" + text + "%'")
                            .returnGeometry(false);

    if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
      query.within(map.getBounds());
    }

    if(this.options.idField){
      query.fields([this.options.idField, this.options.searchField]);
    }

    var request = query.run(function(error, results, raw){
      if(error){
        callback(error, []);
      } else {
        this.options.idField = raw.objectIdFieldName;
        var suggestions = [];
        var count = Math.min(results.features.length, this.options.maxResults);
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          suggestions.push({
            text: feature.properties[this.options.searchField],
            magicKey: feature.id
          });
        };
        callback(error, suggestions.slice(0, this.options.maxResults));
      }
    }, this);

    return request;
  },
  results: function(map, text, key, options, callback){
    var query = this.query()

    if(key){
      query.featureIds([key]);
    } else {
      query.where(this.options.searchField + " LIKE '%"+text+"%'");
    }

    if(options.useMapBounds === true || (options.useMapBounds <= map.getZoom())){
      query.within(map.getBounds());
    }

    return query.run(L.Util.bind(function(error, features){
      var results = [];
      for (var i = 0; i < features; i++) {
        var feature = features.features[i];
        if(feature){
          var bounds = L.geoJson(feature).getBounds();
          var result = feature.properties;
          result.latlng = bounds.getCenter();
          result.bounds = bounds;
          result.text = feature.properties[this.options.searchField];
          results.push(result);
        }
      };
      callback(error, results);
    }, this));
  }
});

L.esri.Controls.Geosearch.Providers.featureLayer = function(url, options){
  return new L.esri.Controls.Geosearch.Providers.FeatureLayer(url, options);
}