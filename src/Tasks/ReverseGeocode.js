L.esri.Tasks.ReverseGeocode = L.esri.Tasks.Task.extend({
  path: 'reverseGeocode',
  params : {
    outSR: 4326
  },
  setters: {
    'distance': 'distance',
    'language': 'language'
  },
  latlng: function (latlng) {
    this.params.location = latlng.lng+',' + latlng.lat;
  },
  run: function(callback, context){
    var path = (this.params.text) ? 'find' : 'findAddressCandidates';

    return this.request(this.params, function(error, response){
      var result;
      if(!error){
        result = {
          latlng: new L.LatLng(response.location.y, response.location.x),
          properties: response.address
        };
      } else {
        result = undefined;
      }

      callback.call(context, error, result, response);
    }, this);
  }
});