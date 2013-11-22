# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with ArcGIS Onlines geocoding services.

**Currently Esri Leaflet Geocoder is in development. Use at your own risk.**

Despite sharing a name and a namespace with Esri Leaflet, Esri Leaflet Geocoder **does not*** require Esri Leaflet. It is however tested with Esri Leaflet and will work just fine with our without it.

## Example

Take a look at the live demo at http://esri.github.io/esri-leaflet-geocoder/

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet Geocoder</title>

    <!-- Load Leaflet from their CDN -->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css" />
    <!--[if lte IE 8]>
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.ie.css" />
    <![endif]-->
    <script src="http://cdn.leafletjs.com/leaflet-0.6.4/leaflet-src.js"></script>

    <!-- Make the map fill the entire page -->
    <style>
      #map {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    </style>

    <script src="src/esri-leaflet-geocoder.js"></script>
    <link rel="stylesheet" href="src/esri-leaflet-geocoder.css" />

  </head>
  <body>

    <div id="map"></div>

    <a href="https://github.com/Esri/esri-leaflet-geocoder"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png" alt="Fork me on GitHub"></a>

    <script>
      var map = L.map('map').setView([45.5165, -122.6764], 12);

      var tiles = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      var searchControl = new L.esri.Controls.Geosearch().addTo(map);

      var results = new L.LayerGroup().addTo(map);

      searchControl.on("result", function(data){
        results.clearLayers();
        results.addLayer(L.marker(data.latlng));
      });

      searchControl.on("results", function(data){
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
          results.addLayer(L.marker(data.results[i].latlng));
        };
      });
    </script>
  </body>
</html>
```

## L.esri.Controls.Geosearch

### Constructor

**Extends** [`L.Control`](http://leafletjs.com/reference.html#control)

Constructor | Options | Description
--- | --- | ---
`new L.esri.Controls.Geosearch(options)`<br>`L.esri.Controls.geosearch(options)` | [`<GeosearchOptions>`](#options) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`position` | `String` | `topleft` | On of the valid Leaflet [control positions](http://leafletjs.com/reference.html#control-positions).
`zoomToResult` | `Boolean` | `true` | If `true` the map will zoom the result after geocoding is complete.
`useMapBounds` | `Boolean` or <br> `Integer` | `11` | Determines if the geocoder should begin using the bounds of the map to enchance search results. If `true` the geocoder will always return results in the current map bounds. If `false` it will always search the world. If an integer like `11` is passed in a search will use the bounds of the map for searhcing is the map is at a zoom level equal or greater then the integer.
`collapseAfterResult` | `Boolean` | `true` | If the geocoder is expanded after a result this will collapse it.
`expanded` | `Boolean` | `true` | Start the control in an expanded state.
`allowMultipleResults` | `true` | When a user hits enter without selecting a suggestion their text will be geocoded within the current bounds of the map. A `results` event will fire with multuiple results. If this is `false` the first suggestion will be used.
`containerClass` | `String` | `"geocoder-control"` | Used for styling the geocoder. See the [styling guide](#Styling) for more details.
`inputClass` | `String` | `"geocoder-control-input"` | Used for styling the geocoder. See the [styling guide](#Styling) for more details.
`suggestionsWrapperClass` | `String` | `"geocoder-control-suggestions"`` | Used for styling the geocoder. See the [styling guide](#Styling) for more details.
`selectedSuggestionClass` | `String` | `"geocoder-control-selected"`` | Used for styling the geocoder. See the [styling guide](#Styling) for more details.
`expandedClass` | `String` | `"geocoder-control-expanded"` | Used for styling the geocoder. See the [styling guide](#Styling) for more details.

### Methods

Method | Options | Description
--- | --- | ---
`clear()` | `null` | Clears the text currently in the geocoder and collapses it if `collapseAfterResult` is true.

### Events

Event | Data | Description
--- | --- | ---
`load` | `null` | A generic event fired when a request to the geocoder starts.
`loading` | `null` | A generic event fired when a request to the geocoder finished.
`result` | [`<ResultEvent>`](#result-event--object) | Fired when a result is returned from the geocoder.

### Styling

Styling the geocoder is possible by changing the `containerClass`, `inputClass`, `suggestionsWrapperClass`, `selectedSuggestionClass` and `expandedClass` options. By changing these options to the classes you want to use for styling and then writing your own CSS.

For reference here is the internal structure of the geocoder...

```html
<div class="geocoder-control leaflet-control">
  
  <input class="geocoder-control-input leaflet-bar">

  <ul class="geocoder-control-suggestions leaflet-bar">
    <li class="geocoder-control-selected">The Selected Result</li>
    <li class="geocoder-control-selected">Another Result</li>
  </ul>
</div>
```

#### Result Event

Property | Type | Description
--- | --- | ---
`text` | `String` | The text that was passed to the geocodeer.
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds arround this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.
`name` | `String` | Name of the geocoded place. Usually something like "Paris" or "Starbucks".
`match` | `String` | What was matched internally in the geocoder. Cooresponded to the [`Addr_type`](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Service_output/02r300000017000000/) field in the geocoding service.
`country` | `String` | The country the geocoded place is located in.
`region` | `String` | The largest administrative area for a country that the geocoded palce is in, typically a state or province.
`subregion` | `String` | The next largest administrative area for a the geocoded place, typically a county or region.
`city` | `String` | The city the geocoded place is located in
`address` | `String` | Complete address returned for the geocoded place. The format is based on address standards for the country within which the address is located.

#### Results Event / Object

Property | Type | Description
--- | --- | ---
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds arround this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.
`results` | [`<ResultObject>`](#result-event--object) | An array of [result objects](#result-event--object).

## L.esri.Services.Geocoding
A basic wrapper for ArcGIS Online geocoding services. Used internally by `L.esri.Controls.Geosearch`.

### Constructor

Constructor | Options | Description
--- | --- | ---
`new L.esri.Controls.Geosearch(options)`<br>`L.esri.Controls.geosearch(options)` | [`<GeosearchOptions>`](#options-1) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | `<WorldGeocodeServiceURL>` | Defaults to the ArcGIS World Geocoding service. Should be the url of the Geocoding service you want to use. If you don't this means don't change this.
`outFields`| `String` | "Subregion, Region, PlaceName, Match_addr, Country, Addr_type, City" | 

### Methods

Method | Options | Description
--- | --- | ---
`geocode(text, object, callback)` | [`<GeocodeOptions>`](#geocode-options) | Geocodes the specified `text` with the passed [`<GeocodeOptions>``](#geocode-options). `callback` will be called with `error` and `response` parameters.
`suggest(text, object, callback)` | [`<SuggestOptions>`](#geocode-options) | Suggests results for `text` with the given [`<SuggestOptions>`](#suggest-options). `callback` will be called with `error` and `response` parameters.

### Events

Event | Data | Description
--- | --- | ---
`load` | `null` | A generic event fired when a request to the geocoder begins.
`loading` | `null` | A generic event fired when a request to the geocoder is finished.

#### Geocode Options

The `geocode` method can accept any options from the [Geocode service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/) with the exception of `text`.

#### Suggest Options

The `suggest` method can accept any options from the [Suggest service](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Working_with_suggestions/02r300000238000000/) with the exception of `text`.

## Development Instructions

1. [Fork and clone Esri Leaflet Geocoder](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet-geocoder` folder
5. Instal the dependancies with `npm install`
5. The example at `/index.html` should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Dependencies

Despite sharing a name and a namespace the Esri Leaflet Geocoder **does not*** require Esri Leaflet. It only requires [Leaflet](http://leaflet.com).

## Resources

* [Geocoding Service Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).


## Licensing
Copyright 2013 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet Geocoding)
[](Esri Language: JavaScript)
