import L from 'leaflet';

export var GeosearchCore = L.Evented.extend({

  options: {
    zoomToResult: true,
    useMapBounds: 12,
    searchBounds: null
  },

  initialize: function (control, options) {
    L.Util.setOptions(this, options);
    this._control = control;

    if (!options || !options.providers || !options.providers.length) {
      throw new Error('You must specify at least one provider');
    }

    this._providers = options.providers;
  },

  _geocode: function (text, key, provider) {
    var activeRequests = 0;
    var allResults = [];
    var bounds;

    var callback = L.Util.bind(function (error, results) {
      activeRequests--;
      if (error) {
        return;
      }

      if (results) {
        allResults = allResults.concat(results);
      }

      if (activeRequests <= 0) {
        bounds = this._boundsFromResults(allResults);

        this.fire('results', {
          results: allResults,
          bounds: bounds,
          latlng: (bounds) ? bounds.getCenter() : undefined,
          text: text
        }, true);

        if (this.options.zoomToResult && bounds) {
          this._control._map.fitBounds(bounds);
        }

        this.fire('load');
      }
    }, this);

    if (key) {
      activeRequests++;
      provider.results(text, key, this._searchBounds(), callback);
    } else {
      for (var i = 0; i < this._providers.length; i++) {
        activeRequests++;
        this._providers[i].results(text, key, this._searchBounds(), callback);
      }
    }
  },

  _suggest: function (text) {
    var activeRequests = this._providers.length;

    var createCallback = L.Util.bind(function (text, provider) {
      return L.Util.bind(function (error, suggestions) {
        if (error) { return; }

        var i;

        activeRequests = activeRequests - 1;

        if (text.length < 2) {
          this._suggestions.innerHTML = '';
          this._suggestions.style.display = 'none';
          return;
        }

        if (suggestions.length) {
          for (i = 0; i < suggestions.length; i++) {
            suggestions[i].provider = provider;
          }
        } else {
          // we still need to update the UI
          this._control._renderSuggestions(suggestions);
        }

        if (provider._lastRender !== text && provider.nodes) {
          for (i = 0; i < provider.nodes.length; i++) {
            if (provider.nodes[i].parentElement) {
              this._control._suggestions.removeChild(provider.nodes[i]);
            }
          }

          provider.nodes = [];
        }

        if (suggestions.length && this._control._input.value === text) {
          this._control.clearSuggestions(provider.nodes);

          provider._lastRender = text;
          provider.nodes = this._control._renderSuggestions(suggestions);
          this._control._nodes = [];
        }
      }, this);
    }, this);

    this._pendingSuggestions = [];

    for (var i = 0; i < this._providers.length; i++) {
      var provider = this._providers[i];
      var request = provider.suggestions(text, this._searchBounds(), createCallback(text, provider));
      this._pendingSuggestions.push(request);
    }
  },

  _searchBounds: function () {
    if (this.options.searchBounds !== null) {
      return this.options.searchBounds;
    }

    if (this.options.useMapBounds === false) {
      return null;
    }

    if (this.options.useMapBounds === true) {
      return this._control._map.getBounds();
    }

    if (this.options.useMapBounds <= this._control._map.getZoom()) {
      return this._control._map.getBounds();
    }

    return null;
  },

  _boundsFromResults: function (results) {
    if (!results.length) {
      return;
    }

    var nullIsland = L.latLngBounds([0, 0], [0, 0]);
    var resultBounds = [];
    var resultLatlngs = [];

    // collect the bounds and center of each result
    for (var i = results.length - 1; i >= 0; i--) {
      var result = results[i];

      resultLatlngs.push(result.latlng);

      // make sure bounds are valid and not 0,0. sometimes bounds are incorrect or not present
      if (result.bounds && result.bounds.isValid() && !result.bounds.equals(nullIsland)) {
        resultBounds.push(result.bounds);
      }
    }

    // form a bounds object containing all center points
    var bounds = L.latLngBounds(resultLatlngs);

    // and extend it to contain all bounds objects
    for (var j = 0; j < resultBounds.length; j++) {
      bounds.extend(resultBounds[j]);
    }

    return bounds;
  },

  _getAttribution: function () {
    var attribs = [];
    var providers = this._providers;

    for (var i = 0; i < providers.length; i++) {
      if (providers[i].options.attribution) {
        attribs.push(providers[i].options.attribution);
      }
    }

    return attribs.join(', ');
  }

});

export function geosearchCore (control, options) {
  return new GeosearchCore(control, options);
}

export default geosearchCore;
