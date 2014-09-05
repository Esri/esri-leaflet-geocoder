L.esri.Tasks.Task = L.esri.Class.extend({
  initialize: function(endpoint){
    if(endpoint.url && endpoint.get){
      this._service = endpoint;
      this.url = endpoint.url;
    } else {
      this.url = L.esri.Util.cleanUrl(endpoint);
    }
  },
  request: function(callback, context){
    if(this._service){
      this._service.get(this.path, this.params, callback, context);
    } else {
      L.esri.get(this.path, this.params, callback, context);
    }
  }
});

L.esri.Tasks.Geocode = L.esri.Class.extend({
  path: 'geocode',
  params : {
    sr: 4326,
    layers: 'all',
    tolerance: 3,
    returnGeometry: true
  }
});