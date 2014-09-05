L.esri.Tasks.Geocode = L.esri.Tasks.Task.extend({

  params : {
    outSr: 4326,
    forStorage: false,
    outFields: '*',
    maxLocations: 20
  },

  setters: {
    'street': 'street',
    'neighborhood': 'neighborhood',
    'city': 'city',
    'subregion': 'subregion',
    'region': 'region',
    'postal': 'postal',
    'country': 'country',
    'address': 'address',
    'text': 'text',
    'category': 'category[]',
    'token' : 'token',
    'key': 'key',
    'fields': 'outFields[]',
    'forStorage': 'forStorage'
  },

  within: function(bounds){
    this.params.bbox = L.esri.Util.boundsToExtent(bounds);
  },

  nearby: function(latlng, radius){
    this.params.location = latlng.lng + "," + latlng.lat;
    this.params.distance = Math.min(Math.max(radius, 2000), 50000);
  },

  run: function(callback, context){
    var path = (this.params.text) ? 'find' : 'findAddressCandidates';

    if(path === 'findAddressCandidates' && this.params.bbox) {
      this.params.searchExtent = this.params.bbox;
      delete this.params.bbox;
    }

    return this.request(function(error, response){
      var processor = (this.params.text === 'find') ? this._processFindResponse : this._processFindAddressCandidatesResponse;
      var results = (!error) ? processor(response) : undefined;
      callback.call(context, error, results, response);
    }, this);
  },

  _processFindResponse: function(response){
    var results = [];

    for (var i = 0; i < response.locations.length; i++) {
      var location = response.locations[i];
      var bounds = L.esri.Util.extentToBounds(location.extent);

      results.push({
        text: location.name,
        bounds: bounds,
        latlng: new L.LatLng(result.feature.geometry.y, result.feature.geometry.x),
        properties: location.feature.attributes
      });
    }

    return results;
  },

  _processFindAddressCandidatesResponse: function(response){
    var results = [];

    for (var i = 0; i < response.canidates.length; i++) {
      var canidate = response.canidates[i];
      var bounds = L.esri.Util.extentToBounds(canidate.extent);
      var properties = canidate.attributes;
      attributes.Score = canidate.score;

      results.push({
        text: canidate.address,
        bounds: bounds,
        latlng: new L.LatLng(canidate.location.y, canidate.location.x),
        properties :attributes
      });
    }

    return results;
  }

});