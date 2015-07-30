EsriLeafletGeocoding.Controls.Geosearch.Providers.FeatureLayer = L.esri.Services.FeatureLayerService.extend({
  options: {
    label: 'Feature Layer',
    maxResults: 5,
    bufferRadius: 1000,
    caseSensitive: false,
    formatSuggestion: function(feature){
      return feature.properties[this.options.searchFields[0]];
    }
  },
  initialize: function(options){
    options.url = L.esri.Util.cleanUrl(options.url);
    L.esri.Services.FeatureLayerService.prototype.initialize.call(this, options);
    L.Util.setOptions(this, options);
    if(typeof this.options.searchFields === 'string'){
      this.options.searchFields = [this.options.searchFields];
    }
  },
  suggestions: function(text, bounds, callback){
    var query = this.query().where(this._buildQuery(text))
                            .returnGeometry(false);

    if(bounds){
      query.intersects(bounds);
    }

    if(this.options.idField){
      query.fields([this.options.idField].concat(this.options.searchFields));
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
            text: this.options.formatSuggestion.call(this, feature),
            magicKey: feature.id
          });
        }
        callback(error, suggestions.slice(0, this.options.maxResults).reverse());
      }
    }, this);

    return request;
  },
  results: function(text, key, bounds, callback){
    var query = this.query();

    if(key){
      query.featureIds([key]);
    } else {
      query.where(this._buildQuery(text));
    }

    if(bounds){
      query.within(bounds);
    }

    return query.run(L.Util.bind(function(error, features){
      var results = [];
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
      callback(error, results);
    }, this));
  },
  _buildQuery: function(text){
    var queryString = [];

    for (var i = this.options.searchFields.length - 1; i >= 0; i--) {
      var field = this.options.searchFields[i];
      
      if (!this.options.caseSensitive) {
        text = text.toUpperCase();
        field = 'upper('+field+')';
      }

      queryString.push(field + ' LIKE \'%' + text + '%\'');
    }

    return queryString.join(' OR ');
  },
  _featureBounds: function(feature){
    var geojson = L.geoJson(feature);
    if(feature.geometry.type === 'Point'){
      var center = geojson.getBounds().getCenter();
      return new L. Circle(center, this.options.bufferRadius).getBounds();
    } else {
      return geojson.getBounds();
    }
  }
});
