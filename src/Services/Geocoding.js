L.esri.Services.Geocoding = L.esri.Services.Service.extend({
  statics: {
    WorldGeocodingService: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/',
    outFields: 'Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City, Place_addr'
  },
  includes: L.Mixin.Events,
  initialize: function (url, options) {
    url = (typeof url === 'string') ? url : L.esri.Services.Geocoding.WorldGeocodingService;
    options = (typeof url === 'object') ? url : options;
    this.url = L.esri.Util.cleanUrl(url);
    L.Util.setOptions(this, options);
    L.esri.Services.Service.prototype.initialize.call(this, url, options);
  },
  geocode: function(text, opts, callback, context){
    var defaults = {
      outFields: this.options.outFields
    };

    var params = L.extend(defaults, opts);

    params.text = text;

    return this.get("find", params, function(error, response){
      if(error) {
        callback.call(context, error);
      } else {
        var results = [];
        for (var i = response.locations.length - 1; i >= 0; i--) {
          var result = response.locations[i];
          results.push(this._processResult(text, result));
        }
        callback.call(context, error, results, response);
      }
    }, this);
  },
  reverse: function(latlng, opts, callback, context){
    var params = opts || {};
    params.location = [latlng.lng, latlng.lat].join(',');
    return this.get('reverseGeocode', params, function(error, response){
      if(error) {
        callback.call(context, error);
      } else {
        var address = response.address;
        var result = {
          latlng: new L.LatLng(response.location.y, response.location.x),
          address: address.Address,
          neighborhood: address.Neighborhood,
          city: address.City,
          subregion: address.Subregion,
          region: address.Region,
          postal: address.Postal,
          postalExt: address.PostalExt,
          countryCode: address.CountryCode
        };
        callback.call(context, error, result, response);
      }
    }, this);
  },
  suggest: function(text, opts, callback, context){
    if(this.url !== L.esri.Services.Geocoding.WorldGeocodingService && console && console.warn){
      console.warn('Only the ArcGIS Online World Geocoder supports suggestions');
    } else {
      var params = opts || {};
      params.text = text;
      return this.get("suggest", params, callback, context);
    }
  },
  _processResult: function(text, result){
    var attributes = result.feature.attributes;
    var bounds = L.esri.Util.extentToBounds(result.extent);

    return {
      text: text,
      bounds: bounds,
      latlng: new L.LatLng(result.feature.geometry.y, result.feature.geometry.x),
      name: attributes.PlaceName,
      match: attributes.Addr_type,
      country: attributes.Country,
      region: attributes.Region,
      subregion: attributes.Subregion,
      city: attributes.City,
      address: attributes.Place_addr ? attributes.Place_addr : attributes.Match_addr
    };
  }
});

L.esri.Services.geocoding = function(options){
  return new L.esri.Services.Geocoding(options);
};