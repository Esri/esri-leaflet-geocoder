import L from 'leaflet';

export var Geosearch = L.Control.extend({
  includes: L.Mixin.Events,

  options: {
    position: 'topleft',
    zoomToResult: true,
    useMapBounds: 12,
    collapseAfterResult: true,
    expanded: false,
    allowMultipleResults: true,
    placeholder: 'Search for places or addresses',
    title: 'Location Search'
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);

    if (!options || !options.providers || !options.providers.length) {
      throw new Error('You must specificy at least one provider');
    }

    this._providers = options.providers;

    // bubble each providers events to the control
    for (var i = 0; i < this._providers.length; i++) {
      this._providers[i].addEventParent(this);
    }

    this._pendingSuggestions = [];

    L.Control.prototype.initialize.call(options);
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
        });

        if (this.options.zoomToResult && bounds) {
          this._map.fitBounds(bounds);
        }

        L.DomUtil.removeClass(this._input, 'geocoder-control-loading');

        this.fire('load');

        this.clear();

        this._input.blur();
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
    L.DomUtil.addClass(this._input, 'geocoder-control-loading');
    var activeRequests = this._providers.length;

    var createCallback = L.Util.bind(function (text, provider) {
      return L.Util.bind(function (error, suggestions) {
        if (error) { return; }

        var i;

        activeRequests = activeRequests - 1;

        if (this._input.value < 2) {
          this._suggestions.innerHTML = '';
          this._suggestions.style.display = 'none';
          return;
        }

        if (suggestions) {
          for (i = 0; i < suggestions.length; i++) {
            suggestions[i].provider = provider;
          }
        }

        if (provider._lastRender !== text && provider.nodes) {
          for (i = 0; i < provider.nodes.length; i++) {
            if (provider.nodes[i].parentElement) {
              this._suggestions.removeChild(provider.nodes[i]);
            }
          }

          provider.nodes = [];
        }

        if (suggestions.length && this._input.value === text) {
          if (provider.nodes) {
            for (var k = 0; k < provider.nodes.length; k++) {
              if (provider.nodes[k].parentElement) {
                this._suggestions.removeChild(provider.nodes[k]);
              }
            }
          }

          provider._lastRender = text;
          provider.nodes = this._renderSuggestions(suggestions);
        }

        if (activeRequests === 0) {
          L.DomUtil.removeClass(this._input, 'geocoder-control-loading');
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
    if (this.options.useMapBounds === false) {
      return null;
    }

    if (this.options.useMapBounds === true) {
      return this._map.getBounds();
    }

    if (this.options.useMapBounds <= this._map.getZoom()) {
      return this._map.getBounds();
    }

    return null;
  },

  _renderSuggestions: function (suggestions) {
    var currentGroup;
    this._suggestions.style.display = 'block';

    // set the maxHeight of the suggestions box to
    // map height
    // - suggestions offset (distance from top of suggestions to top of control)
    // - control offset (distance from top of control to top of map)
    // - 10 (extra padding)
    this._suggestions.style.maxHeight = (this._map.getSize().y - this._suggestions.offsetTop - this._wrapper.offsetTop - 10) + 'px';

    var nodes = [];
    var list;
    var header;

    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      if (!header && this._providers.length > 1 && currentGroup !== suggestion.provider.options.label) {
        header = L.DomUtil.create('span', 'geocoder-control-header', this._suggestions);
        header.textContent = suggestion.provider.options.label;
        header.innerText = suggestion.provider.options.label;
        currentGroup = suggestion.provider.options.label;
        nodes.push(header);
      }

      if (!list) {
        list = L.DomUtil.create('ul', 'geocoder-control-list', this._suggestions);
      }

      var suggestionItem = L.DomUtil.create('li', 'geocoder-control-suggestion', list);

      suggestionItem.innerHTML = suggestion.text;
      suggestionItem.provider = suggestion.provider;
      suggestionItem['data-magic-key'] = suggestion.magicKey;
    }

    nodes.push(list);

    return nodes;
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
      bounds.extend(resultBounds[i]);
    }

    return bounds;
  },

  clear: function () {
    this._suggestions.innerHTML = '';
    this._suggestions.style.display = 'none';
    this._input.value = '';

    if (this.options.collapseAfterResult) {
      this._input.placeholder = '';
      L.DomUtil.removeClass(this._wrapper, 'geocoder-control-expanded');
    }

    if (!this._map.scrollWheelZoom.enabled() && this._map.options.scrollWheelZoom) {
      this._map.scrollWheelZoom.enable();
    }
  },

  getAttribution: function () {
    var attribs = [];

    for (var i = 0; i < this._providers.length; i++) {
      if (this._providers[i].options.attribution) {
        attribs.push(this._providers[i].options.attribution);
      }
    }

    return attribs.join(', ');
  },

  onAdd: function (map) {
    this._map = map;
    this._wrapper = L.DomUtil.create('div', 'geocoder-control ' + ((this.options.expanded) ? ' ' + 'geocoder-control-expanded' : ''));
    this._input = L.DomUtil.create('input', 'geocoder-control-input leaflet-bar', this._wrapper);
    this._input.title = this.options.title;

    this._suggestions = L.DomUtil.create('div', 'geocoder-control-suggestions leaflet-bar', this._wrapper);

    var credits = this.getAttribution();
    map.attributionControl.addAttribution(credits);

    L.DomEvent.addListener(this._input, 'focus', function (e) {
      this._input.placeholder = this.options.placeholder;
      L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
    }, this);

    L.DomEvent.addListener(this._wrapper, 'click', function (e) {
      L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
      this._input.focus();
    }, this);

    L.DomEvent.addListener(this._suggestions, 'mousedown', function (e) {
      var suggestionItem = e.target || e.srcElement;
      this._geocode(suggestionItem.innerHTML, suggestionItem['data-magic-key'], suggestionItem.provider);
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, 'blur', function (e) {
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, 'keydown', function (e) {
      L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');

      var list = this._suggestions.querySelectorAll('.' + 'geocoder-control-suggestion');
      var selected = this._suggestions.querySelectorAll('.' + 'geocoder-control-selected')[0];
      var selectedPosition;

      for (var i = 0; i < list.length; i++) {
        if (list[i] === selected) {
          selectedPosition = i;
          break;
        }
      }

      switch (e.keyCode) {
        case 13:
          if (selected) {
            this._geocode(selected.innerHTML, selected['data-magic-key'], selected.provider);
            this.clear();
          } else if (this.options.allowMultipleResults) {
            this._geocode(this._input.value, undefined);
            this.clear();
          } else {
            L.DomUtil.addClass(list[0], 'geocoder-control-selected');
          }
          L.DomEvent.preventDefault(e);
          break;
        case 38:
          if (selected) {
            L.DomUtil.removeClass(selected, 'geocoder-control-selected');
          }

          var previousItem = list[selectedPosition - 1];

          if (selected && previousItem) {
            L.DomUtil.addClass(previousItem, 'geocoder-control-selected');
          } else {
            L.DomUtil.addClass(list[list.length - 1], 'geocoder-control-selected');
          }
          L.DomEvent.preventDefault(e);
          break;
        case 40:
          if (selected) {
            L.DomUtil.removeClass(selected, 'geocoder-control-selected');
          }

          var nextItem = list[selectedPosition + 1];

          if (selected && nextItem) {
            L.DomUtil.addClass(nextItem, 'geocoder-control-selected');
          } else {
            L.DomUtil.addClass(list[0], 'geocoder-control-selected');
          }
          L.DomEvent.preventDefault(e);
          break;
        default:
          // when the input changes we should cancel all pending suggestion requests if possible to avoid result collisions
          for (var x = 0; x < this._pendingSuggestions.length; x++) {
            var request = this._pendingSuggestions[x];
            if (request && request.abort && !request.id) {
              request.abort();
            }
          }
          break;
      }
    }, this);

    L.DomEvent.addListener(this._input, 'keyup', L.Util.throttle(function (e) {
      var key = e.which || e.keyCode;
      var text = (e.target || e.srcElement).value;

      // require at least 2 characters for suggestions
      if (text.length < 2) {
        this._suggestions.innerHTML = '';
        this._suggestions.style.display = 'none';
        L.DomUtil.removeClass(this._input, 'geocoder-control-loading');
        return;
      }

      // if this is the escape key it will clear the input so clear suggestions
      if (key === 27) {
        this._suggestions.innerHTML = '';
        this._suggestions.style.display = 'none';
        return;
      }

      // if this is NOT the up/down arrows or enter make a suggestion
      if (key !== 13 && key !== 38 && key !== 40) {
        if (this._input.value !== this._lastValue) {
          this._lastValue = this._input.value;
          this._suggest(text);
        }
      }
    }, 50, this), this);

    L.DomEvent.disableClickPropagation(this._wrapper);

    // when mouse moves over suggestions disable scroll wheel zoom if its enabled
    L.DomEvent.addListener(this._suggestions, 'mouseover', function (e) {
      if (map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
        map.scrollWheelZoom.disable();
      }
    });

    // when mouse moves leaves suggestions enable scroll wheel zoom if its disabled
    L.DomEvent.addListener(this._suggestions, 'mouseout', function (e) {
      if (!map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
        map.scrollWheelZoom.enable();
      }
    });

    return this._wrapper;
  },

  onRemove: function (map) {
    map.attributionControl.removeAttribution('Geocoding by Esri');
  }
});

export function geosearch (options) {
  return new Geosearch(options);
}

export default geosearch;
