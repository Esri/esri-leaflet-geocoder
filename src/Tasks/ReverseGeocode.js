EsriLeafletGeocoding.Tasks.ReverseGeocode = Esri.Tasks.Task.extend({
  path: 'reverseGeocode',

  params : {
    outSR: 4326
  },

  setters: {
    'distance': 'distance',
    'language': 'language'
  },

  initialize: function(options){
    options = options || {};
    options.url = options.url || EsriLeafletGeocoding.WorldGeocodingService;
    Esri.Tasks.Task.prototype.initialize.call(this, options);
  },

  latlng: function (latlng) {
    latlng = L.latLng(latlng);
    this.params.location = latlng.lng + ',' + latlng.lat;
    return this;
  },

  run: function(callback, context){
    return this.request(function(error, response){
      var result;

      if(!error){
        result = {
          latlng: new L.LatLng(response.location.y, response.location.x),
          address: response.address
        };
      } else {
        result = undefined;
      }

      callback.call(context, error, result, response);
    }, this);
  }
});

EsriLeafletGeocoding.Tasks.reverseGeocode = function(options){
  return new EsriLeafletGeocoding.Tasks.ReverseGeocode(options);
};