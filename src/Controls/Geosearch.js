import {
  Control,
  DomEvent,
  DomUtil,
  Evented,
  Util,
  latLngBounds
} from 'leaflet';
import { geosearchCore } from '../Classes/GeosearchCore';
import { arcgisOnlineProvider } from '../Providers/ArcgisOnlineGeocoder';
import { Util as EsriUtil } from 'esri-leaflet';

export var Geosearch = Control.extend({
  includes: Evented.prototype,

  options: {
    position: 'topleft',
    collapseAfterResult: true,
    expanded: false,
    allowMultipleResults: true,
    placeholder: 'Search for places or addresses',
    title: 'Location Search'
  },

  initialize: function (options) {
    Util.setOptions(this, options);

    if (!options || !options.providers || !options.providers.length) {
      if (!options) {
        options = {};
      }
      options.providers = [arcgisOnlineProvider()];
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

    Control.prototype.initialize.call(this, options);
  },

  _renderSuggestions: function (suggestions) {
    var currentGroup;

    if (suggestions.length > 0) {
      this._suggestions.style.display = 'block';
    }

    var list;
    var header;
    var suggestionTextArray = [];

    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      if (!header && this._geosearchCore._providers.length > 1 && currentGroup !== suggestion.provider.options.label) {
        header = DomUtil.create('div', 'geocoder-control-header', suggestion.provider._contentsElement);
        header.textContent = suggestion.provider.options.label;
        header.innerText = suggestion.provider.options.label;
        currentGroup = suggestion.provider.options.label;
      }

      if (!list) {
        list = DomUtil.create('ul', 'geocoder-control-list', suggestion.provider._contentsElement);
      }

      if (suggestionTextArray.indexOf(suggestion.text) === -1) {
        var suggestionItem = DomUtil.create('li', 'geocoder-control-suggestion', list);

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

    // when the geocoder position is either "topleft" or "topright":
    // set the maxHeight of the suggestions box to:
    //  map height
    //  - suggestions offset (distance from top of suggestions to top of control)
    //  - control offset (distance from top of control to top of map)
    //  - 10 (extra padding)
    if (this.getPosition().indexOf('top') > -1) {
      this._suggestions.style.maxHeight = (this._map.getSize().y - this._suggestions.offsetTop - this._wrapper.offsetTop - 10) + 'px';
    }

    // when the geocoder position is either "bottomleft" or "bottomright":
    // 1. set the maxHeight of the suggestions box to:
    //  map height
    //  - corner control container offsetHeight (height of container of bottom corner)
    //  - control offsetHeight (height of geocoder control wrapper, the main expandable button)
    // 2. to move it up, set the top of the suggestions box to:
    //  negative offsetHeight of suggestions box (its own negative height now that it has children elements
    //  - control offsetHeight (height of geocoder control wrapper, the main expandable button)
    //  + 20 (extra spacing)
    if (this.getPosition().indexOf('bottom') > -1) {
      this._setSuggestionsBottomPosition();
    }
  },

  _setSuggestionsBottomPosition: function () {
    this._suggestions.style.maxHeight = (this._map.getSize().y - this._map._controlCorners[this.getPosition()].offsetHeight - this._wrapper.offsetHeight) + 'px';
    this._suggestions.style.top = (-this._suggestions.offsetHeight - this._wrapper.offsetHeight + 20) + 'px';
  },

  _boundsFromResults: function (results) {
    if (!results.length) {
      return;
    }

    var nullIsland = latLngBounds([0, 0], [0, 0]);
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
    var bounds = latLngBounds(resultLatlngs);

    // and extend it to contain all bounds objects
    for (var j = 0; j < resultBounds.length; j++) {
      bounds.extend(resultBounds[j]);
    }

    return bounds;
  },

  clear: function () {
    this._clearAllSuggestions();

    if (this.options.collapseAfterResult) {
      this._input.value = '';
      this._lastValue = '';
      this._input.placeholder = '';
      DomUtil.removeClass(this._wrapper, 'geocoder-control-expanded');
    }

    if (!this._map.scrollWheelZoom.enabled() && this._map.options.scrollWheelZoom) {
      this._map.scrollWheelZoom.enable();
    }
  },

  _clearAllSuggestions: function () {
    this._suggestions.style.display = 'none';

    for (var i = 0; i < this.options.providers.length; i++) {
      this._clearProviderSuggestions(this.options.providers[i]);
    }
  },

  _clearProviderSuggestions: function (provider) {
    provider._contentsElement.innerHTML = '';
  },

  _finalizeSuggestions: function (activeRequests, suggestionsLength) {
    // check if all requests are finished to remove the loading indicator
    if (!activeRequests) {
      DomUtil.removeClass(this._input, 'geocoder-control-loading');

      // when the geocoder position is either "bottomleft" or "bottomright",
      // it is necessary in some cases to recalculate the maxHeight and top values of the this._suggestions element,
      // even though this is also being done after each provider returns their own suggestions
      if (this.getPosition().indexOf('bottom') > -1) {
        this._setSuggestionsBottomPosition();
      }

      // also check if there were 0 total suggest results to clear the parent suggestions element
      // otherwise its display value may be "block" instead of "none"
      if (!suggestionsLength) {
        this._clearAllSuggestions();
      }
    }
  },

  _setupClick: function () {
    DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
    this._input.focus();
  },

  disable: function () {
    this._input.disabled = true;
    DomUtil.addClass(this._input, 'geocoder-control-input-disabled');
    DomEvent.removeListener(this._wrapper, 'click', this._setupClick, this);
  },

  enable: function () {
    this._input.disabled = false;
    DomUtil.removeClass(this._input, 'geocoder-control-input-disabled');
    DomEvent.addListener(this._wrapper, 'click', this._setupClick, this);
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

    if (
      suggestionItem.classList.contains('geocoder-control-suggestions') ||
      suggestionItem.classList.contains('geocoder-control-header')
    ) {
      return;
    }

    // make sure and point at the actual 'geocoder-control-suggestion'
    if (suggestionItem.classList.length < 1) {
      suggestionItem = suggestionItem.parentNode;
    }

    this._geosearchCore._geocode(suggestionItem.unformattedText, suggestionItem['data-magic-key'], suggestionItem.provider);
    this.clear();
  },

  onAdd: function (map) {
    // include 'Powered by Esri' in map attribution
    EsriUtil.setEsriAttribution(map);

    this._map = map;
    this._wrapper = DomUtil.create('div', 'geocoder-control');
    this._input = DomUtil.create('input', 'geocoder-control-input leaflet-bar', this._wrapper);
    this._input.title = this.options.title;

    if (this.options.expanded) {
      DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
      this._input.placeholder = this.options.placeholder;
    }

    // create the main suggested results container element
    this._suggestions = DomUtil.create('div', 'geocoder-control-suggestions leaflet-bar', this._wrapper);

    // create a child contents container element for each provider inside of this._suggestions
    // to maintain the configured order of providers for suggested results
    for (var i = 0; i < this.options.providers.length; i++) {
      this.options.providers[i]._contentsElement = DomUtil.create('div', null, this._suggestions);
    }

    var credits = this._geosearchCore._getAttribution();

    if (map.attributionControl) {
      map.attributionControl.addAttribution(credits);
    }

    DomEvent.addListener(this._input, 'focus', function (e) {
      this._input.placeholder = this.options.placeholder;
      DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');
    }, this);

    DomEvent.addListener(this._wrapper, 'click', this._setupClick, this);

    // make sure both click and touch spawn an address/poi search
    DomEvent.addListener(this._suggestions, 'mousedown', this.geocodeSuggestion, this);

    DomEvent.addListener(this._input, 'blur', function (e) {
      // TODO: this is too greedy and should not "clear"
      // when trying to use the scrollbar or clicking on a non-suggestion item (such as a provider header)
      this.clear();
    }, this);

    DomEvent.addListener(this._input, 'keydown', function (e) {
      var text = (e.target || e.srcElement).value;

      DomUtil.addClass(this._wrapper, 'geocoder-control-expanded');

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
            this._input.value = selected.innerText;
            this._geosearchCore._geocode(selected.unformattedText, selected['data-magic-key'], selected.provider);
            this.clear();
          } else if (this.options.allowMultipleResults && text.length >= 2) {
            this._geosearchCore._geocode(this._input.value, undefined);
            this.clear();
          } else {
            if (list.length === 1) {
              DomUtil.addClass(list[0], 'geocoder-control-selected');
              this._geosearchCore._geocode(list[0].innerHTML, list[0]['data-magic-key'], list[0].provider);
            } else {
              this.clear();
              this._input.blur();
            }
          }
          DomEvent.preventDefault(e);
          break;
        case 38:
          if (selected) {
            DomUtil.removeClass(selected, 'geocoder-control-selected');
          }

          var previousItem = list[selectedPosition - 1];

          if (selected && previousItem) {
            DomUtil.addClass(previousItem, 'geocoder-control-selected');
          } else {
            DomUtil.addClass(list[list.length - 1], 'geocoder-control-selected');
          }
          DomEvent.preventDefault(e);
          break;
        case 40:
          if (selected) {
            DomUtil.removeClass(selected, 'geocoder-control-selected');
          }

          var nextItem = list[selectedPosition + 1];

          if (selected && nextItem) {
            DomUtil.addClass(nextItem, 'geocoder-control-selected');
          } else {
            DomUtil.addClass(list[0], 'geocoder-control-selected');
          }
          DomEvent.preventDefault(e);
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

    DomEvent.addListener(this._input, 'keyup', Util.throttle(function (e) {
      var key = e.which || e.keyCode;
      var text = (e.target || e.srcElement).value;

      // require at least 2 characters for suggestions
      if (text.length < 2) {
        this._lastValue = this._input.value;
        this._clearAllSuggestions();
        DomUtil.removeClass(this._input, 'geocoder-control-loading');
        return;
      }

      // if this is the escape key it will clear the input so clear suggestions
      if (key === 27) {
        this._clearAllSuggestions();
        return;
      }

      // if this is NOT the up/down arrows or enter make a suggestion
      if (key !== 13 && key !== 38 && key !== 40) {
        if (this._input.value !== this._lastValue) {
          this._lastValue = this._input.value;
          DomUtil.addClass(this._input, 'geocoder-control-loading');
          this._geosearchCore._suggest(text);
        }
      }
    }, 50, this), this);

    DomEvent.disableClickPropagation(this._wrapper);

    // when mouse moves over suggestions disable scroll wheel zoom if its enabled
    DomEvent.addListener(this._suggestions, 'mouseover', function (e) {
      if (map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
        map.scrollWheelZoom.disable();
      }
    });

    // when mouse moves leaves suggestions enable scroll wheel zoom if its disabled
    DomEvent.addListener(this._suggestions, 'mouseout', function (e) {
      if (!map.scrollWheelZoom.enabled() && map.options.scrollWheelZoom) {
        map.scrollWheelZoom.enable();
      }
    });

    this._geosearchCore.on('load', function (e) {
      DomUtil.removeClass(this._input, 'geocoder-control-loading');
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
