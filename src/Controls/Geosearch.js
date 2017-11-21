import L from 'leaflet';
import { geosearchCore } from '../Classes/GeosearchCore';
import { arcgisOnlineProvider } from '../Providers/ArcgisOnlineGeocoder';
import { Util } from 'esri-leaflet';

export var Geosearch = L.Control.extend({
  includes: L.Evented.prototype,

  options: {
    position: 'topleft',
    collapseAfterResult: true,
    expanded: false,
    allowMultipleResults: true,
    placeholder: 'Search for places or addresses',
    title: 'Location Search'
  },

  initialize: function (options) {
    L.Util.setOptions(this, options);

    if (!options || !options.providers || !options.providers.length) {
      if (!options) {
        options = {};
      }
      options.providers = [ arcgisOnlineProvider() ];
    }

    // instantiate the underlying class and pass along options
    this._geosearchCore = geosearchCore(this, options);
    this._geosearchCore._providers = options.providers;

    // bubble each providers events to the control
    this._geosearchCore.addEventParent(this);
    for (var i = 0; i < this._geosearchCore._providers.length; i++) {
      this._geosearchCore._providers[i].addEventParent(this);
    }

    this._geosearchCore._pendingSuggestions = [];

    L.Control.prototype.initialize.call(options);
  },

  _renderSuggestions: function (suggestions) {
    var currentGroup;

    if (suggestions.length > 0) {
      this._suggestions.style.display = 'block';
    }
    // set the maxHeight of the suggestions box to
    // map height
    // - suggestions offset (distance from top of suggestions to top of control)
    // - control offset (distance from top of control to top of map)
    // - 10 (extra padding)
    this._suggestions.style.maxHeight = (this._map.getSize().y - this._suggestions.offsetTop - this._wrapper.offsetTop - 10) + 'px';

    var nodes = [];
    var list;
    var header;
    var suggestionTextArray = [];

    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      if (!header && this._geosearchCore._providers.length > 1 && currentGroup !== suggestion.provider.options.label) {
        header = L.DomUtil.create('span', 'geocoder-control-header', this._suggestions);
        header.textContent = suggestion.provider.options.label;
        header.innerText = suggestion.provider.options.label;
        currentGroup = suggestion.provider.options.label;
        nodes.push(header);
      }

      if (!list) {
        list = L.DomUtil.create('ul', 'geocoder-control-list', this._suggestions);
      }

      if (suggestionTextArray.indexOf(suggestion.text) === -1) {
        var suggestionItem = L.DomUtil.create('li', 'geocoder-control-suggestion', list);

        suggestionItem.innerHTML = suggestion.text;
        suggestionItem.provider = suggestion.provider;
        suggestionItem['data-magic-key'] = suggestion.magicKey;
        suggestionItem.unformattedText = suggestion.unformattedText;
      } else {
        for (var j = 0; j < list.childNodes.length; j++) {
          // if the same text already appears in the list of suggestions, append an additional ObjectID to its magicKey instead
          if (list.childNodes[j].innerHTML === suggestion.text) {
            list.childNodes[j]['data-magic-key'] += ',' + suggestion.magicKey;
          }
        }
      }
      suggestionTextArray.push(suggestion.text);
    }

    L.DomUtil.removeClass(this._input, 'geocoder-control-loading');

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
      bounds.extend(resultBounds[j]);
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

  clearSuggestions: function () {
    if (this._nodes) {
      for (var k = 0; k < this._nodes.length; k++) {
        if (this._nodes[k].parentElement) {
          this._suggestions.removeChild(this._nodes[k]);
        }
      }
    }
  },

  _setupClick: function () {
    L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
    this._input.focus();
  },

  disable: function () {
    this._input.disabled = true;
    L.DomUtil.addClass(this._input, 'geocoder-control-input-disabled');
    L.DomEvent.removeListener(this._wrapper, 'click', this._setupClick, this);
  },

  enable: function () {
    this._input.disabled = false;
    L.DomUtil.removeClass(this._input, 'geocoder-control-input-disabled');
    L.DomEvent.addListener(this._wrapper, 'click', this._setupClick, this);
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

  geocodeSuggestion: function (e) {
    var suggestionItem = e.target || e.srcElement;

    // make sure and point at the actual 'geocoder-control-suggestion'
    if (suggestionItem.classList.length < 1) {
      suggestionItem = suggestionItem.parentNode;
    }

    this._geosearchCore._geocode(suggestionItem.unformattedText, suggestionItem['data-magic-key'], suggestionItem.provider);
    this.clear();
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    Util.setEsriAttribution(map);

    this._map = map;
    this._wrapper = L.DomUtil.create('div', 'geocoder-control');
    this._input = L.DomUtil.create('input', 'geocoder-control-input leaflet-bar', this._wrapper);
    this._input.title = this.options.title;

    if (this.options.expanded) {
      L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
      this._input.placeholder = this.options.placeholder;
    }

    this._suggestions = L.DomUtil.create('div', 'geocoder-control-suggestions leaflet-bar', this._wrapper);

    var credits = this._geosearchCore._getAttribution();
    map.attributionControl.addAttribution(credits);

    L.DomEvent.addListener(this._input, 'focus', function (e) {
      this._input.placeholder = this.options.placeholder;
      L.DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
    }, this);

    L.DomEvent.addListener(this._wrapper, 'click', this._setupClick, this);

    // make sure both click and touch spawn an address/poi search
    L.DomEvent.addListener(this._suggestions, 'mousedown', this.geocodeSuggestion, this);
    L.DomEvent.addListener(this._suggestions, 'touchend', this.geocodeSuggestion, this);

    L.DomEvent.addListener(this._input, 'blur', function (e) {
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, 'keydown', function (e) {
      var text = (e.target || e.srcElement).value;

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
          /*
            if an item has been selected, geocode it
            if focus is on the input textbox, geocode only if multiple results are allowed and more than two characters are present, or if a single suggestion is displayed.
            if less than two characters have been typed, abort the geocode
          */
          if (selected) {
            this._geosearchCore._geocode(selected.unformattedText, selected['data-magic-key'], selected.provider);
            this.clear();
          } else if (this.options.allowMultipleResults && text.length >= 2) {
            this._geosearchCore._geocode(this._input.value, undefined);
            this.clear();
          } else {
            if (list.length === 1) {
              L.DomUtil.addClass(list[0], 'geocoder-control-selected');
              this._geosearchCore._geocode(list[0].innerHTML, list[0]['data-magic-key'], list[0].provider);
            } else {
              this.clear();
              this._input.blur();
            }
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
          for (var x = 0; x < this._geosearchCore._pendingSuggestions.length; x++) {
            var request = this._geosearchCore._pendingSuggestions[x];
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
          L.DomUtil.addClass(this._input, 'geocoder-control-loading');
          this._geosearchCore._suggest(text);
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

    this._geosearchCore.on('load', function (e) {
      L.DomUtil.removeClass(this._input, 'geocoder-control-loading');
      this.clear();
      this._input.blur();
    }, this);

    return this._wrapper;
  }
});

export function geosearch (options) {
  return new Geosearch(options);
}

export default geosearch;
