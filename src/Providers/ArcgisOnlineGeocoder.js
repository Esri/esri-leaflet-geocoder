import { GeocodeService } from '../Services/Geocode';

export var ArcgisOnlineProvider = GeocodeService.extend({
  options: {
    label: 'Places and Addresses',
    maxResults: 5
  },

  suggestions: function (text, bounds, callback) {
    var request = this.suggest().text(text);

    if (bounds) {
      request.within(bounds);
    }

    if (this.options.nearby) {
      // "distance"/"radius" is not supported by the ArcGIS Online Geocoder,
      // so that is intentionally not passed here:
      request.nearby(this.options.nearby);
    }

    if (this.options.countries) {
      request.countries(this.options.countries);
    }

    if (this.options.categories) {
      request.category(this.options.categories);
    }

    // 15 is the maximum number of suggestions that can be returned
    request.maxSuggestions(this.options.maxResults);

    return request.run(function (error, results, response) {
      var suggestions = [];
      if (!error) {
        while (response.suggestions.length && suggestions.length <= (this.options.maxResults - 1)) {
          var suggestion = response.suggestions.shift();
          if (!suggestion.isCollection) {
            suggestions.push({
              text: suggestion.text,
              unformattedText: suggestion.text,
              magicKey: suggestion.magicKey
            });
          }
        }
      }
      callback(error, suggestions);
    }, this);
  },

  results: function (text, key, bounds, callback) {
    var request = this.geocode().text(text);

    if (key) {
      request.key(key);
    }
    // in the future Address/StreetName geocoding requests that include a magicKey will always only return one match
    request.maxLocations(this.options.maxResults);

    if (bounds) {
      request.within(bounds);
    }

    if (this.options.forStorage) {
      request.forStorage(true);
    }

    if (this.options.nearby) {
      // "distance"/"radius" is not supported by the ArcGIS Online Geocoder,
      // so that is intentionally not passed here:
      request.nearby(this.options.nearby);
    }

    if (this.options.countries) {
      request.countries(this.options.countries);
    }

    if (this.options.categories) {
      request.category(this.options.categories);
    }

    return request.run(function (error, response) {
      callback(error, response.results);
    }, this);
  }
});

export function arcgisOnlineProvider (options) {
  return new ArcgisOnlineProvider(options);
}

export default arcgisOnlineProvider;
