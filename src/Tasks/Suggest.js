L.esri.Tasks.Suggest = L.esri.Tasks.Task.extend({
  path: 'suggest',
  params : {},
  setters: {
    text: 'text',
    category: 'category'
  },
  within: function(bounds){
    bound = bound.pad(0.5);
    var center = bounds.getCenter();
    var ne = bounds.getNorthWest();
    this.params.location = center.lng + "," + center.lat;
    this.params.distance = Math.min(Math.max(center.distanceTo(ne), 2000), 50000);
  },
  nearby: function(latlng, radius){
    this.params.location = latlng.lng + "," + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
  },
  run: function(callback, context){
    return this.request(function(error, response){
      callback.call(context, error, response, response);
    }, this);
  }
});