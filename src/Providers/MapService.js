L.esri.Controls.Geosearch.Providers.MapService = L.esri.Services.MapService.extend({
  options: {
    label: 'Map Service'
  },
  initialize: function(url, options){
    L.esri.Services.MapService.prototype.initialize.call(this, url, options);
    this._getIdField();
  },
  suggestions: function(map, text, options, callback){
    var request = this.find().text(text).returnGeometry(false).layers([this.options.layer]);

    if(this._idField){
      request.fields([this.options.searchField, this.options._idField]);
    }

    return request.run(function(error, results){
      var suggestions = [];

      if(this._idField && !error){
        var count = Math.min(this.options.maxResults, results.features.length);
        for (var i = 0; i < count; i++) {
          var suggestion = results.features[i];
          suggestions.push({
            text: suggestion.properties[this.options.searchField],
            magicKey: suggestion.properties[this._idField]
          });
        }
      }

      callback(error, suggestions);
    }, this);
  },
  results: function(map, text, key, options, callback){
    var results = [];
    var request;

    if(key){
      request = this.find().text(text).contains(false).layers(this.options.layer);
    } else {
      request = this.query().layer(this.options.layer).featureIds(key);
    }

    if(this._idField){
      request.fields([this.options.searchField, this.options._idField]);
    }

    request.run(function(error, features){
      if(this._idField && !error){
        for (var i = 0; i < features.features.length; i++) {
          var feature = features.features[i];
          if(feature){
            var bounds = L.geoJson(feature).getBounds();
            var result = feature.properties;
            result.latlng = bounds.getCenter();
            result.bounds = bounds;
            result.text = feature.properties[this.options.searchField];
            results.push(result);
          }
        }
      }
      callback(error, results);
    }, this);
  },
  _getIdField: function(){
    this.get(this.options.layer, {}, function(error, metadata){
      for (var i = 0; i < metadata.fields.length; i++) {
        var field = metadata.fields[i];
        if(field.type === 'esriFieldTypeOID'){
          this._idField = field.name;
          break;
        }
      }
    }, this);
  }
});

L.esri.Controls.Geosearch.Providers.mapService = function(url, options){
  return new L.esri.Controls.Geosearch.Providers.MapService(url, options);
};