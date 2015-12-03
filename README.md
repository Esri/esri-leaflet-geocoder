# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with the ArcGIS Online geocoding services.

[![Build Status](https://travis-ci.org/Esri/esri-leaflet-geocoder.svg?branch=master)](https://travis-ci.org/Esri/esri-leaflet-geocoder)

## Example

Take a look at the [live demo](http://esri.github.com/esri-leaflet/examples/geocoding-control.html).

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Esri Leaflet Geocoder</title>
    <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-1.0.0-b1/leaflet.js"></script>
    <!-- Esri Leaflet -->
    <script src="//cdn.jsdelivr.net/leaflet.esri/2.0.0-beta.6/esri-leaflet.js"></script>
    <!-- Esri Leaflet Geocoder -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/leaflet.esri.geocoder/2.0.0/esri-leaflet-geocoder.css">
    <script src="//cdn.jsdelivr.net/leaflet.esri.geocoder/2.0.0/esri-leaflet-geocoder.js"></script>
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
</head>

<body>
    <div id="map"></div>
    <script>
    var map = L.map('map').setView([45.5165, -122.6764], 12);

    var tiles = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();

    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch({
        providers: [arcgisOnline]
    }).addTo(map);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(map);

    // listen for the results event and add every result to the map
    searchControl.on("results", function(data) {
        results.clearLayers();
        for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
        };
    });
    </script>
</body>
</html>
```

## L.esri.Geocoding.geosearch

### Constructor

**Extends** [`L.Control`](http://leafletjs.com/reference.html#control)

Constructor | Options | Description
--- | --- | ---
`L.esri.Geocoding.geosearch(options)` | [`<GeosearchOptions>`](#options) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`position` | `String` | `topleft` | One of the valid Leaflet [control positions](http://leafletjs.com/reference.html#control-positions).
`zoomToResult` | `Boolean` | `true` | If `true` the map will zoom the result after geocoding is complete.
`useMapBounds` | `Boolean` or <br> `Integer` | `12` | Determines if and when the geocoder should begin using the bounds of the map to enchance search results. If `true` the geocoder will always return results in the current map bounds. If `false` it will always search the world. If an integer like `11` is passed in the geocoder will use the bounds of the map for searching if the map is at a zoom level equal to or greater than the integer. This mean the geocoder will prefer local results when the map is zoomed in.
`collapseAfterResult` | `Boolean` | `true` | If the geocoder is expanded after a result this will collapse it.
`expanded` | `Boolean` | `false` | Start the control in an expanded state.
`allowMultipleResults` | `Boolean` | `true` | If set to `true` and the user submits the form without a suggestion selected geocodes the current text in the input and zooms the user to view all the results.
`providers` | `Array` | See Description | An array of [providers](#providers) to search.
`placeholder` | `String` | `'Search for places or addresses'` | Placeholder text for the search input.
`title` | `String` | `Location Search` | Title text for the search input. Shows as tool tip on hover.

### Methods

Method | Options | Description
--- | --- | ---
`clear()` | `null` | Clears the text currently in the geocoder and collapses it if `collapseAfterResult` is true.

### Events

Event | Data | Description
--- | --- | ---
`load` | `null` | A generic event fired when a request to the geocoder starts.
`loading` | `null` | A generic event fired when a request to the geocoder finished.
`results` | [`<ResultsEvent>`](#results-event) | Fired when a result is returned from the geocoder.

Events from each [provider](#providers) and will match the events fired by [L.esri.service events](http://esri.github.io/esri-leaflet/api-reference/services/service.html).

### Styling
For reference here is the internal structure of the geocoder...

```html
<div class="geocoder-control leaflet-control">

  <input class="geocoder-control-input leaflet-bar">

  <ul class="geocoder-control-suggestions leaflet-bar">
    <li class="geocoder-control-suggestion geocoder-control-selected">The Selected Result</li>
    <li class="geocoder-control-suggestion">Another Result</li>
  </ul>
</div>
```

### Providers

The `Geosearch` control can also search for results from a variety of sources including Feature Layers and Map Services. This is done with plain text matching and is not "real" geocoding, but it allows you to mix in custom search results.

```js
var arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider();
var gisDay = L.esri.Geocoding.featureLayerProvider({
  url: 'https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/GIS_Day_Final/FeatureServer/0',
  searchFields: ['Name', 'Organization'], // Search these fields for text matches
  label: 'GIS Day Events', // Group suggestions under this header
  formatSuggestion: function(feature){
    return feature.properties.Name + ' - ' + feature.properties.Organization; // format suggestions like this.
  }
});

L.esri.Geocoding.geosearch({
  providers: [arcgisOnline, gisDay] // will geocode via ArcGIS Online and search the GIS Day feature service.
}).addTo(map);
```

#### Available Providers

* `L.esri.Geocoding.arcgisOnlineProvider(options)` - Uses the ArcGIS Online World Geocoding service.
* `L.esri.Geocoding.featureLayerProvider(options)` - Gets results by querying the Feature Layer for text matches.
* `L.esri.Geocoding.mapServiceProvider(options)` - Uses the find and query methods on the Map Service to get text matches.
* `L.esri.Geocoding.geocodeServiceProvider` - Use an ArcGIS Server Geocode Service, supports suggestions if available with ARcGIS Server 10.3 and up.

#### Providers

All providers share the following options:

Option | Type | Default | Description
--- | --- | --- | ---
`label` | `String` | Varies by Provider | Text that will be used to group suggestions under when more than one provider is being used.
`maxResults` | `Integer` | 5 | Maximum number of results to show for this provider.
`attribution` | `String` | Varies by Provider | Adds an attribution to the map.

##### `arcgisOnlineProvider`

Option | Type | Default | Description
--- | --- | --- | ---
`countries` | `String` `Array[Strings]` | null | Limit results to one or more countries. Any ISO 3166 2 or 3 digit [country code supported by the ArcGIS World Geocode service](https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm) is allowed. *Note* using an array of country codes may result in inaccurate results even when a specific suggestion is supplied.
`categories` | `String` `Array[Strings]` | null | Limit results to one or more categories. See the [list of valid categories](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B) for possible values.
`forStorage` | `Boolean` | false | Indicates whether results will be stored permanently (more information can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-free-vs-paid.htm).

Results from the `arcgisOnlineProvider` will have an additional `properties` key which will correspond with [all available fields on the ArcGIS Online World Geocode service](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-service-output.htm#ESRI_SECTION1_42D7D3D0231241E9B656C01438209440)

##### `geocodeServiceProvider`

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | *Required* | The URL for the service that will be searched.
`label` | `String` | `'Geocode Service'` | Text that will be used to group suggestions under when more than one provider is being used.
`maxResults` | `Integer` | 5 | Maximum number of results to show for this provider.

Results from the `geocodeServiceProvider` will have an additional `properties` key which will correspond with all the available fields in the service.

##### `featureLayerProvider`

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | *Required* | The URL for the service that will be searched.
`searchFields` | `String` `Array[Strings]` | None | An array of fields to search for text.
`formatSuggestion`| `Function` | See Description | Formatting function for the suggestion text. Receives feature information and returns a string.
`bufferRadius`, | `Integer` | If a service or layer contains points, buffer points by this radius to create bounds.

Results from the `featureLayerProvider` will have an additional `properties` key which will contain all the information for the feature and a `geojson` key that will contain a [GeoJSON](http://geojson.org/) representation of the feature.

##### `mapServiceProvider`

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | *Required* | The URL for the service that will be searched.
`searchFields` | `String` `Array[Strings]` | None | An array of fields to search for text.
`layer` | `Integer` | `0` | The layer to find text matches on. Can also be an array of layer identifiers.
`formatSuggestion`| `Function` | See Description | Formatting function for the suggestion text. Receives feature information and returns a string.
`bufferRadius`, | `Integer` `Array[Integers]`| Buffer point results by this radius to create bounds.

Results from the `mapServiceProvider` will have an additional `properties` key which will contain all the information for the feature and a `geojson` key that will contain a [GeoJSON](http://geojson.org/) representation of the feature.

#### Results Event

Property | Type | Description
--- | --- | ---
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds around this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the results.
`results` | [`[<ResultObject>]`](#result-object) | An array of [result objects](#result-object).

#### Result Object

A single result from a provider. You should not rely on all these properties being present in every result object and some providers may add additional properties.

Property | Type | Description
--- | --- | ---
`text` | `String` | The text that was passed to the provider.
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds around this result. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.

The result object will also contain any additional properties from the provider. See the [available providers](#available-providers) for which additional fields may be present.

## L.esri.Geocoding.geocodeService
A basic wrapper for ArcGIS Online geocoding services. Used internally by `L.esri.Geocoding.geosearch`.

### Constructor

Constructor | Description
--- | ---
`L.esri.Geocoding.geocodeService(options)` | Creates a new Geocoding service. You can pass the `url` in the options to reference a custom geocoding endpoint if you do not want to use the ArcGIS Online World Geocoding service.

### Options

You can pass any options you can pass to L.esri.Services.Service. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`geocode()` | L.esri.Geocoding.geocode | Returns a new Geocode task bound to this server.
`suggest()` | L.esri.Geocoding.suggest | Returns a new Suggest task bound to this server.
`reverse()` | L.esri.Geocoding.reverseGeocode | Returns a new ReverseGeocode task bound to this server.

### Events

L.esri.Geocoding.geocodeService fires all [L.esri.service events](http://esri.github.io/esri-leaflet/api-reference/services/service.html).

## L.esri.Geocoding.geocode

### Constructor

Constructor | Description
--- | ---
`L.esri.Geocoding.geocode(options)` | Creates a new Geocode task.

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the [ArcGIS World Geocoder](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm) by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`text(text <String>)` | `this` | The text to geocode. If you specify `text` all other params like `address`, `city`, `subregion`, and `region`, `postal`, and `country` will be ignored.
`address(text <String>)` | Specify the street and house number to be geocoded.
`neighborhood(text <String>)` | Specify the neighborhood to be geocoded.
`city(text <String>)` | Specify the city to be geocoded.
`subregion(text <String>)` | Specify the subregion to be geocoded. Depending on the country, subregion can represent a county, state, or province.
`region(text <String>)` | Specify the region to be geocoded. Typically a state or province
`postal(text <String>)` | Specify the postal code to be geocoded.
`country(text <String>)` | Specify the country to be geocoded.
`category(category <String>)` | The category to search for suggestions. By default no category. A list of categories can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B)
`within(bounds <L.LatLngBounds>)` | A bounding box to search for suggestions in.
`nearby(latlng <L.LatLng>, distance <Integer>)` | Searches for suggestions only inside an area around the LatLng. `distance` is in meters.
`run(callback <Function>, context <Object>)` | `XMLHttpRequest` | Executes this request chain and accepts the response callback.

### Examples

```js
L.esri.Geocoding.geocode().text('380 New York St, Redlands, California, 92373').run(function(err, results, response){
  console.log(results);
});
```

```js
L.esri.Geocoding.geocode().address('380 New York St').city('Redlands').region('California').postal(92373).run(function(err, results, response){
  console.log(results);
});
```

```js
//Using .within()
var southWest = L.latLng(37.712, -108.227),
    northEast = L.latLng(41.774, -102.125),
    bounds = L.latLngBounds(southWest, northEast); // Colorado

L.esri.Geocoding.geocode().text("Denver").within(bounds).run(function(err, response){
  console.log(response);
});
```

```js
//Using .nearby()
var denver = L.latLng(37.712, -108.227);

L.esri.Geocoding.geocode().text("Highlands Ranch").nearby(denver, 20000).run(function(err, response){
  console.log(response);
});
```

### Results Object

In the above examples the `results` object will look like this.

```js
{
  results: [
    {
      latlng: L.LatLng,
      text: 'Formatted Address',
      score: 100, // ranking of the certainty of the match
      properties: {
        // additional info like specific address components like Country Code ect...
      }
    }
  ]
}
```

## L.esri.Geocoding.suggest

### Constructor

Constructor | Description
--- | ---
`L.esri.Geocoding.suggest(options)` | Creates a new Suggest task using the ArcGIS World Geocoder.

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the [ArcGIS World Geocoder](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm) by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`text(text <String>)` | `this` | The text to receive suggestions for.
`category(category Array[Strings])` | The category to search for suggestions. By default no category. A list of categories can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B)
`countries(category Array[Strings])` | Limit results to one or more countries. Any ISO 3166 2 or 3 digit [country code](https://developers.arcgis.com/rest/geocode/api-reference/geocode-coverage.htm) supported by the ArcGIS World Geocode service is allowed. *Note* using an array of country codes may result in inaccurate results even when a specific suggestion is supplied.
`within(bounds <L.LatLngBounds>)` | A bounding box to search for suggestions in.
`nearby(latlng <L.LatLng>, distance <Integer>)` | Improves the rank of suggestions near a known location. The unit of measure for `distance` is meters.
`run(callback <Function>, context<Object>)` | `XMLHttpRequest` | Executes this request chain and accepts the response callback.

### Example

```js
L.esri.Geocoding.suggest().text('trea').nearby([45,-121], 5000).run(function(error, response){
  // response matches the suggest API response https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm#ESRI_SECTION1_FC3884A45AD24E62BD11C9888F1392DB
});
```

## L.esri.Geocoding.reverseGeocode

### Constructor

Constructor | Description
--- | ---
`L.esri.Geocoding.reverseGeocode(options)` | Creates a new ReverseGeocode task. `L.esri.Geocoding.WorldGeocodingService` can be used as a reference to the [ArcGIS World Geocoder](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm).

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`latlng(latlng <L.LatLng>)` | The L.LatLng object for which the address will be looked up.
`distance(distance <Integer>)` | The distance (in meters) around the point for which addresses will be looked up.
`language(langCode <String>)` | `this` | The language to return the address in. More information can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm#ESRI_SECTION1_ABD1AD449DF54FFEB9527A606341714C).
`intersection(returnIntersection <Boolean>)` | `this` | Set this value to `true` if you'd like the nearest intersection to be returned (Default value is `false`).
`run(callback <Function>, context <Object>)` | `XMLHttpRequest` | Executes this request chain and accepts the response callback.

### Example

```js
L.esri.Geocoding.reverseGeocode().intersection(true).latlng([48.8583,  2.2945]).run(function(error, result, response){
  // callback is called with error, result, and response.
  // result.latlng contains the latlng of the located address
  // result.address contains the address information
});
```

## Development Instructions

1. [Fork and clone Esri Leaflet Geocoder](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet-geocoder` folder
5. Install the dependencies with `npm install`
5. The example at `/index.html` should work
6. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Resources

* [Geocoding Service Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Terms and Conditions

In order the use the ArcGIS Online Geocoding Service you should signup for an [ArcGIS for Developers account](https://developers.arcgis.com/en/plans) or purchase an [ArcGIS Online Organizational Subscription](http://www.arcgis.com/features/plans/pricing.html).

1. Once you have an account you are good to go. Thats it!
2. Your users can search for as many places as they want. Esri defines this as "Geosearch" and its free. You only consume credits when you want to store the result of geocodes.
3. You are  allowed to store the results of any geocoding you do if you pass the `forStorage` flag and a valid access token.
4. If you use this library in a revenue generating application or for government use you must upgrade to a paid account. You are not allowed to generate revenue while on a free plan.

This information is from the [ArcGIS for Developers Terms of Use FAQ](https://developers.arcgis.com/en/terms/faq/) and the [ArcGIS Online World Geocoder documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)

## Licensing
Copyright 2015 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license.txt]( https://raw.github.com/Esri/esri-leaflet-geocoder/master/license.txt) file.

[](Esri Tags: ArcGIS Web Mapping Leaflet Geocoding)
[](Esri Language: JavaScript)
