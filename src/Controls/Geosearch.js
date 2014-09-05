L.esri.Controls.Geosearch = L.Control.extend({
  includes: L.Mixin.Events,
  options: {
    position: 'topleft',
    zoomToResult: true,
    useMapBounds: 12,
    collapseAfterResult: true,
    expanded: false,
    forStorage: false,
    allowMultipleResults: true,
    useArcgisWorldGeocoder: true,
    providers: []
  },
  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._service = new L.esri.Services.Geocoding(options);
    this._service.on('authenticationrequired requeststart requestend requesterror requestsuccess', function (e) {
      e = L.extend({
        target: this
      }, e);
      this.fire(e.type, e);
    }, this);

    if(this.options.useArcgisWorldGeocoder){
      this.options.providers.push(new L.esri.Controls.Geosearch.Providers.ArcgisOnline());
    }

    if(this.options.maxResults){
      for (var i = 0; i < this.options.providers.length; i++) {
        this.options.providers[i].options.maxResults = this.options.maxResults;
      }
    }

    this._pendingSuggestions = [];
  },
  _geocode: function(text, key, provider){
    var activeRequests = 0;
    var allResults = [];
    var bounds;

    var callback = L.Util.bind(function(error, results){
      activeRequests--;

      if(results){
        allResults = allResults.concat(results);
      }

      if(activeRequests <= 0){
        console.log(allResults);
        bounds = this._boundsFromResults(allResults);

        this.fire('results', {
          results: allResults,
          bounds: bounds,
          latlng: (bounds) ? bounds : undefined,
          text: text
        });

        if(this.options.zoomToResult && bounds){
          this._map.fitBounds(bounds);
        }

        L.DomUtil.removeClass(this._input, "geocoder-control-loading");

        this.fire('load');

        this.clear();

        this._input.blur();
      }
    }, this);

    if(key){
      activeRequests++;
      provider.results(this._map, text, key, this.options, callback);
    } else {
      for (var i = 0; i < this.options.providers.length; i++) {
        activeRequests++;
        this.options.providers[i].results(this._map, text, key, this.options, callback);
      }
    }
  },
  _suggest: function(text){
    L.DomUtil.addClass(this._input, "geocoder-control-loading");
    var activeRequests = this.options.providers.length;
    var allSuggestions = [];

    var createCallback = L.Util.bind(function(text, provider){
      return L.Util.bind(function(error, suggestions){
        activeRequests = activeRequests - 1;

        if(this._input.value < 2) {
          this._suggestions.innerHTML = "";
          this._suggestions.style.display = "none";
          return;
        }

        if(suggestions){
          for (var i = 0; i < suggestions.length; i++) {
            suggestions[i].provider = provider;
          }

          allSuggestions = allSuggestions.concat(suggestions);
        }

        if(activeRequests === 0 && this._input.value === text && allSuggestions.length){
          this._renderSuggestions(allSuggestions, provider);
          L.DomUtil.removeClass(this._input, "geocoder-control-loading");
        }
      }, this);
    }, this);

    this._pendingSuggestions = [];

    for (var i = 0; i < this.options.providers.length; i++) {
      var provider = this.options.providers[i];
      var request = provider.suggestions(this._map, text, this.options, createCallback(text, provider));
      this._pendingSuggestions.push(request);
    }
  },

  _renderSuggestions: function(suggestions){
    var currentGroup;
    this._suggestions.innerHTML = "";
    this._suggestions.style.display = "block";
    for (var i = 0; i < suggestions.length; i++) {
      var suggestion = suggestions[i];
      if(this.options.providers.length > 1 && currentGroup !== suggestion.provider.options.label){
        header = L.DomUtil.create('span', "geocoder-control-header", this._suggestions);
        header.innerText = suggestion.provider.options.label;
        currentGroup = suggestion.provider.options.label;
      }
      var list = L.DomUtil.create('ul', "geocoder-control-list", this._suggestions);
      var suggestionItem = L.DomUtil.create('li', 'geocoder-control-suggestion', list);
      suggestionItem.innerHTML = suggestion.text;
      suggestionItem.provider = suggestion.provider;
      suggestionItem["data-magic-key"] = suggestion.magicKey;
    }
  },
  _boundsFromResults: function(results){
    if(!results.length){
      return;
    }

    var nullIsland = new L.LatLngBounds([0,0], [0,0]);
    var bounds = new L.LatLngBounds();

    for (var i = results.length - 1; i >= 0; i--) {
      var result = results[i];

      // make sure bounds are valid and not 0,0. sometimes bounds are incorrect or not present
      if(result.bounds.isValid() && !result.bounds.equals(nullIsland)){
        bounds.extend(result.bounds);
      }

      // ensure that the bounds include the results center point
      bounds.extend(result.latlng);
    }

    return bounds;
  },
  clear: function(){
    this._suggestions.innerHTML = "";
    this._suggestions.style.display = "none";
    this._input.value = "";

    if(this.options.collapseAfterResult){
      L.DomUtil.removeClass(this._wrapper, "geocoder-control-expanded");
    }
  },
  appendTo: function(node, map){
    node.appendChild(this.onAdd(map));
  },
  removeFrom: function(node){
    node.removeChild(this._container);
    this._map = null;

    if (this.onRemove) {
      this.onRemove(map);
    }
  },
  onAdd: function (map) {
    this._map = map;

    if (map.attributionControl) {
      map.attributionControl.addAttribution('Geocoding by Esri');
    }

    this._wrapper = L.DomUtil.create('div', "geocoder-control" + ((this.options.expanded) ? " " + "geocoder-control-expanded"  : ""));

    this._input = L.DomUtil.create('input', "geocoder-control-input leaflet-bar", this._wrapper);

    this._suggestions = L.DomUtil.create('div', "geocoder-control-suggestions leaflet-bar", this._wrapper);

    L.DomEvent.addListener(this._input, "focus", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");
    }, this);

    L.DomEvent.addListener(this._wrapper, "click", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");
      this._input.focus();
    }, this);

    L.DomEvent.addListener(this._suggestions, "mousedown", function(e){
      var suggestionItem = e.target || e.srcElement;
      this._geocode(suggestionItem.innerHTML, suggestionItem["data-magic-key"], suggestionItem.provider);
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, "blur", function(e){
      this.clear();
    }, this);

    L.DomEvent.addListener(this._input, "keydown", function(e){
      L.DomUtil.addClass(this._wrapper, "geocoder-control-expanded");

      var list = this._suggestions.querySelectorAll('.' + "geocoder-control-suggestion");
      var selected = this._suggestions.querySelectorAll('.' + "geocoder-control-selected")[0];
      var selectedPosition;

      for (var i = 0; i < list.length; i++) {
        if(list[i] === selected){
          selectedPosition = i;
          break;
        }
      }

      switch(e.keyCode){
      case 13:
        if(selected){
          this._geocode(selected.innerHTML, selected["data-magic-key"], selected.provider);
          this.clear();
        } else if(this.options.allowMultipleResults){
          this._geocode(this._input.value, undefined);
          this.clear();
        } else {
          L.DomUtil.addClass(list[0], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      case 38:
        if(selected){
          L.DomUtil.removeClass(selected, "geocoder-control-selected");
        }

        var previousItem = list[selectedPosition-1];

        if(selected && previousItem) {
          L.DomUtil.addClass(previousItem, "geocoder-control-selected");
        } else {
          L.DomUtil.addClass(list[list.length-1], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      case 40:
        if(selected){
          L.DomUtil.removeClass(selected, "geocoder-control-selected");
        }

        var nextItem = list[selectedPosition+1];

        if(selected && nextItem) {
          L.DomUtil.addClass(nextItem, "geocoder-control-selected");
        } else {
          L.DomUtil.addClass(list[0], "geocoder-control-selected");
        }
        L.DomEvent.preventDefault(e);
        break;
      default:
        // when the input changes we should cancel all pending suggestion requests if possible to avoid result collisions
        for (var i = 0; i < this._pendingSuggestions.length; i++) {
          if(this._pendingSuggestions[i] && this._pendingSuggestions[i].abort){
            this._pendingSuggestions[i].abort();
          }
        }
        break;
      }
    }, this);

    L.DomEvent.addListener(this._input, "keyup", L.Util.limitExecByInterval(function(e){
      var key = e.which || e.keyCode;
      var text = (e.target || e.srcElement).value;

      // require at least 2 characters for suggestions
      if(text.length < 2) {
        this._suggestions.innerHTML = "";
        this._suggestions.style.display = "none";
        L.DomUtil.removeClass(this._input, "geocoder-control-loading");
        return;
      }

      // if this is the escape key it will clear the input so clear suggestions
      if(key === 27){
        this._suggestions.innerHTML = "";
        this._suggestions.style.display = "none";
        return;
      }

      // if this is NOT the up/down arrows or enter make a suggestion
      if(key !== 13 && key !== 38 && key !== 40){
        this._suggest(text);
      }
    }, 50, this), this);

    L.DomEvent.disableClickPropagation(this._wrapper);

    return this._wrapper;
  },
  onRemove: function (map) {
    map.attributionControl.removeAttribution('Geocoding by Esri');
  }
});

L.esri.Controls.geosearch = function(url, options){
  return new L.esri.Controls.Geosearch(url, options);
};

L.esri.Controls.Geosearch.Providers = {}