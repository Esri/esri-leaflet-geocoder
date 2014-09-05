L.esri.Controls.Geosearch.Providers.GeoJSON = L.Class.extend({
  options:{
    label: 'GeoJSON',
    maxResults: 5,
    bufferRadius: 500
  },
  initialize: function(geojson, options){
    L.Util.setOptions(this, options);
    this._features = {}

    for (var i = 0; i < geojson.features.length; i++) {
      var feature = geojson.features[i];
      feature.id = feature.id || i;
      this._features[feature.id] = feature;
    }

    this._fuse = new Fuse(geojson.features, {
      keys: ['properties.' + this.options.property],
      includeScore: true
    });
  },
  suggestions: function (map, text, options, callback) {
    var features = this._fuse.search(text);
    var suggestions = [];
    var mapBounds = map.getBounds();

    while(features.length && suggestions.length <= (this.options.maxResults - 1)){
      var feature = features.shift().item;

      if((options.useMapBounds === true || (options.useMapBounds <= map.getZoom())) && options.useMapBounds !== false){
        var geometry = L.geoJson(feature);
        if(!geometry.getBounds().intersects(mapBounds)){
          continue;
        }
      }

      suggestions.push({
        text: this._deepValue(feature.properties, this.options.property),
        magicKey: feature.id
      });
    }

    setTimeout(function(){
      callback(undefined, suggestions);
    }, 100);
  },
  results: function(map, text, key, options, callback){
    var search = key ? [{item:this._features[key]}] : this._fuse.search(text);
    var results = [];
    for (var i = 0; i < search.length; i++) {
      var feature = search[i].item;
      var result = feature.properties;
      var layer = L.GeoJSON.geometryToLayer(feature);
      var bounds;

      if(layer.getBounds){
        bounds = layer.getBounds();
      } else if (layer.getLatLng){
        bounds = L.circle(layer.getLatLng(), this.options.bufferRadius).getBounds();
      }

      result.text = this._deepValue(feature.properties, this.options.property);
      result.magicKey = feature.id;
      result.bounds = bounds;
      result.latlng = bounds.getCenter();
      results.push(result);
    }
    callback(undefined, results);
  },
  _deepValue: function(obj, path) {
    var i;
    for (i = 0, path = path.split('.'), len = path.length; i < len; i++) {
      if (!obj) {
        return null;
      }
      obj = obj[path[i]];
    }
    return obj;
  }
});

L.esri.Controls.Geosearch.Providers.geoJson = function(geojson, options){
  return new L.esri.Controls.Geosearch.Providers.GeoJSON(geojson, options);
}