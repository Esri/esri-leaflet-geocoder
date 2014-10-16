EsriLeafletGeocoding.Tasks.ReverseGeocode = Esri.Tasks.Task.extend({
  path: 'reverseGeocode',

  params : {
    outSR: 4326
  },
  setters: {
    'distance': 'distance',
    'language': 'language'
  },

  initialize: function (url, options) {
    url = (typeof url === 'string') ? url : EsriLeafletGeocoding.WorldGeocodingService;
    options = (typeof url === 'object') ? url : (options || {});
    this.url = Esri.Util.cleanUrl(url);
    L.Util.setOptions(this, options);
    Esri.Tasks.Task.prototype.initialize.call(this, url, options);
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

EsriLeafletGeocoding.Tasks.reverseGeocode = function(url, options){
  return new EsriLeafletGeocoding.Tasks.ReverseGeocode(url, options);
};