EsriLeafletGeocoding.Controls.Geosearch.Providers.MapService = L.esri.Services.MapService.extend({
  options: {
    layer: 0,
    label: 'Map Service',
    bufferRadius: 1000,
    maxResults: 5,
    formatSuggestion: function(feature){
      return feature.properties[this.options.searchFields[0]];
    }
  },
  initialize: function(url, options){
    L.esri.Services.MapService.prototype.initialize.call(this, url, options);
    this._getIdField();
  },
  suggestions: function(text, bounds, callback){
    var request = this.find().text(text).returnGeometry(false).layers(this.options.layer);

    if (this._idField) {
      request.fields(this.options.searchFields);
    }

    return request.run(function(error, results){
      var suggestions = [];

      if(this._idField && !error){
        var count = Math.min(this.options.maxResults, results.features.length);
        for (var i = 0; i < count; i++) {
          var feature = results.features[i];
          suggestions.push({
            text: this.options.formatSuggestion.call(this, feature),
            magicKey: feature.properties[this._idField]
          });
        }
      }

      callback(error, suggestions.reverse());
    }, this);
  },
  results: function(text, key, bounds, callback){
    var results = [];
    var request;

    if(key){
      request = this.query().layer(this.options.layer).featureIds(key);
    } else {
      request = this.find().text(text).contains(false).layers(this.options.layer);
    }

    if(this._idField){
      request.fields(this.options.searchFields);
    }

    return request.run(function(error, features){
      if(this._idField && !error){
        for (var i = 0; i < features.features.length; i++) {
          var feature = features.features[i];
          if(feature){
            var bounds = this._featureBounds(feature);
            var result = {
              latlng: bounds.getCenter(),
              bounds: bounds,
              text: this.options.formatSuggestion.call(this, feature),
              properties: feature.properties
            };
            results.push(result);
          }
        }
      }
      callback(error, results.reverse());
    }, this);
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  },
  _getIdField: function(){
    this.get(this.options.layer, {}, function(error, metadata){
      for (var i = 0; i < metadata.fields.length; i++) {
        var field = metadata.fields[i];
        if(field.type === 'esriFieldTypeOID'){
          this._idField = field.name;
          this.options.searchFields.push(field.name);
          break;
        }
      }
    }, this);
  }
});