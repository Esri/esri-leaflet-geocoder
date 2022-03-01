import { GeocodeService } from '../Services/Geocode';

export var GeocodeServiceProvider = GeocodeService.extend({
  options: {
    label: 'Geocode Server',
    maxResults: 5
  },

  suggestions: function (text, bounds, callback) {
    if (this.options.supportsSuggest) {
      var request = this.suggest().text(text);
      if (bounds) {
        request.within(bounds);
      }

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
    } else {
      callback(null, []);
      return false;
    }
  },

  results: function (text, key, bounds, callback) {
    var request = this.geocode().text(text);

    if (key) {
      request.key(key);
    }

    request.maxLocations(this.options.maxResults);

    if (bounds) {
      request.within(bounds);
    }

    return request.run(function (error, response) {
      callback(error, response.results);
    }, this);
  }
});

export function geocodeServiceProvider (options) {
  return new GeocodeServiceProvider(options);
}

export default geocodeServiceProvider;
