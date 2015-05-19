# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with the ArcGIS Online geocoding services.

![Travis CI](https://travis-ci.org/Esri/esri-leaflet-geocoder.svg)

**Currently Esri Leaflet Geocoder is in development and should be thought of as a beta or preview**

Esri Leaflet Geocoder relies on the minimal Esri Leaflet Core which handles abstraction for requests and authentication when neccessary. You can find out more about the Esri Leaflet Core on the [Esri Leaflet downloads page](http://esri.github.com/esri-leaflet/downloads).

## Example

Take a look at the [live demo](http://esri.github.com/esri-leaflet/examples/geocoding-control.html).

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Esri Leaflet Geocoder</title>

    <!-- Load Leaflet from their CDN -->
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet-src.js"></script>

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

    <!-- Esri Leaflet Core -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet/0.0.1-beta.5/esri-leaflet-core.js"></script>

    <!-- Esri Leaflet Geocoder -->
    <script src="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/0.0.1-beta.3/esri-leaflet-geocoder.js"></script>
    <link rel="stylesheet" type="text/css" href="http://cdn-geoweb.s3.amazonaws.com/esri-leaflet-geocoder/0.0.1-beta.3/esri-leaflet-geocoder.css">
  </head>
  <body>
    <div id="map"></div>
    <script>
      var map = L.map('map').setView([45.5165, -122.6764], 12);

      var tiles = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

      // create the geocoding control and add it to the map
      var searchControl = new L.esri.Controls.Geosearch().addTo(map);

      // create an empty layer group to store the results and add it to the map
      var results = new L.LayerGroup().addTo(map);

      // listen for the results event and add every result to the map
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

## L.esri.Geocoding.Controls.Geosearch

### Constructor

**Extends** [`L.Control`](http://leafletjs.com/reference.html#control)

Constructor | Options | Description
--- | --- | ---
`new L.esri.Controls.Geosearch(options)`<br>`L.esri.Controls.geosearch(options)` | [`<GeosearchOptions>`](#options) | Creates a new Geosearch control.

### Options

Option | Type | Default | Description
--- | --- | --- | ---
`position` | `String` | `topleft` | One of the valid Leaflet [control positions](http://leafletjs.com/reference.html#control-positions).
`zoomToResult` | `Boolean` | `true` | If `true` the map will zoom the result after geocoding is complete.
`useMapBounds` | `Boolean` or <br> `Integer` | `12` | Determines if and when the geocoder should begin using the bounds of the map to enchance search results. If `true` the geocoder will always return results in the current map bounds. If `false` it will always search the world. If an integer like `11` is passed in the geocoder will use the bounds of the map for searching if the map is at a zoom level equal to or greater than the integer. This mean the geocoder will prefer local results when the map is zoomed in.
`collapseAfterResult` | `Boolean` | `true` | If the geocoder is expanded after a result this will collapse it.
`expanded` | `Boolean` | `true` | Start the control in an expanded state.
`maxResults` | `Integer` | `25` | The maximum number of results to return from a geocoding request. Max is 50.
`allowMultipleResults` | `Boolean` | `true` | If set to `true` and the user submits the form without a suggestion selected geocodes the current text in the input and zooms the user to view all the results.
`useArcgisWorldGeocoder` | `Boolean` | `true` | Use the ArcGIS Online World Geocoder by default in the array of providers.
`providers` | `Array` | See Description | An array of `EsriLeafletGeocoding.Controls.Geosearch.Providers` objects. These additional providers will also be searched for possible results and added to the suggestion list.
`placeholder` | `String` | `'Search for places or addresses'` | Placeholder text for the search input.
`title` | `String` | `Location Search` | Title text for the search input. Shows as tool tip on hover.
`mapAttribution` | `String` | `Geocoding by Esri` | Custom geocoding attribution to be added to map. This setting is ignored and the default attribution is used if `useArcgisworldgeocoder` is `true`.

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

The `Geosearch` control can also search for results from a variety of sources including Feature Layers and Map Services. This is done with plain text matching and is not "real" geocoding. But it allows you to mix custom results into a search box.

```js
var gisDay = new L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer({
  url: 'https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/GIS_Day_Final/FeatureServer/0',
  searchFields: ['Name', 'Organization'], // Search these fields for text matches
  label: 'GIS Day Events', // Group suggestions under this header
  formatSuggestion: function(feature){
    return feature.properties.Name + ' - ' + feature.properties.Organization; // format suggestions like this.
  }
});

L.esri.Geocoding.Controls.geosearch({
  providers: [gisDay]
}).addTo(map);
```

#### Available Providers

* `L.esri.Geocoding.Controls.Geosearch.Providers.ArcGISOnline` - Included by default unless the `useArcgisWorldGeocoder` option is set to false.
* `L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer` - Gets results by querying the Feature Layer for text matches.
* `L.esri.Geocoding.Controls.Geosearch.Providers.MapService` - Uses the find and query methods on the Map Service to get text matches.
* `L.esri.Geocoding.Controls.Geosearch.Providers.GeocodeService` - Use a ArcGIS Server Geocode Service. This option does not support suggestions.

#### Provider Options

Option | Type | Default | Description
--- | --- | --- | ---
`url` | `String` | Depends | The URL for the service that will be used to search. Varys by provider, usually a service or layer URL or a geocoding service URL.
`searchFields` | `Array[Strings]` | None | An array of fields to search for text. Not valid for the `ArcGISOnline` and `GeocodeService` providers.
`layer` | `Integer` | `0` | Only valid for `MapService` providers, the layer to find text matches on.
`label` | `String` | Provider Type | Text that will be used to group suggestions under.
`maxResults` | `Integer` | 5 | Maximum number of results to show for this provider.
`bufferRadius`, | `Integer` | If a service or layer contains points, buffer points by this radius to create bounds. Not valid for the `ArcGISOnline` and `GeocodeService` providers
`formatSuggestion`| `Function` | See Description | Formating function for the suggestion text from `FeatureLayer` provider. Receives a feature and returns a string.

#### Results Event

Property | Type | Description
--- | --- | ---
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds around this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.
`results` | [`[<ResultObject>]`](#result-object) | An array of [result objects](#result-object).

#### Result Object

A single result from the geocoder. You should not rely on all these properties being present in every result object.

Property | Type | Description
--- | --- | ---
`text` | `String` | The text that was passed to the geocoder.
`bounds` | [`L.LatLngBounds`](http://leafletjs.com/reference.html#latlngbounds)| The bounds around this suggestion. Good for zooming to results like cities and states.
`latlng` | [`L.LatLng`](http://leafletjs.com/reference.html#latlng)| The center of the result.

The result object will also contain any additional properties from the provider. So when geocoding you will also get address breakdowns and when text matching features you will get the additional fields from that feature.

## L.esri.Geocoding.Services.Geocoding
A basic wrapper for ArcGIS Online geocoding services. Used internally by `L.esri.Controls.Geosearch`.

### Constructor

Constructor | Description
--- | ---
`new L.esri.Geocoding.Services.Geocoding(options)`<br>`L.esri.Geocoding.Services.geocoding(options)` | Creates a new Geocoding service. You can pass the `url` in the options to reference a custom geocoding endpoint if you do not want to use the ArcGIS Online World Geocoding service.

### Options

You can pass any options you can pass to L.esri.Services.Service. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`geocode()` | L.esri.Geocoding.Tasks.Geocode | Returns a new Geocode task bound to this server.
`suggest()` | L.esri.Geocoding.Tasks.Suggest | Returns a new Suggest task bound to this server.
`reverse()` | L.esri.Geocoding.Tasks.ReverseGeocode | Returns a new ReverseGeocode task bound to this server.

### Events

L.esri.Services.FeatureLayer fires all L.esri.Services.service events.

## L.esri.Geocoding.Tasks.Geocode

### Constructor

Constructor | Description
--- | ---
`new L.esri.Geocoding.Tasks.Geocode(options)`<br>`L.esri.Geocoding.Tasks.geocode(options)` | Creates a new Geocode task.

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

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
L.esri.Geocoding.Tasks.geocode().text('380 New York St, Redlands, California, 92373').run(function(err, results, response){
  console.log(results);
});
```

```js
L.esri.Geocoding.Tasks.geocode().address('380 New York St').city('Redlands').region('California').postal(92373).run(function(err, results, response){
  console.log(results);
});
```

```js
//Using .within()
var southWest = L.latLng(37.712, -108.227),
    northEast = L.latLng(41.774, -102.125),
    bounds = L.latLngBounds(southWest, northEast); // Colorado

L.esri.Geocoding.Tasks.geocode().text("Denver").within(bounds).run(function(err, response){
  console.log(response);
});
```

```js
//Using .nearby()
var denver = L.latLng(37.712, -108.227);

L.esri.Geocoding.Tasks.geocode().text("Highlands Ranch").nearby(denver, 20000).run(function(err, response){
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
      text: 'Formated Address',
      score: 100, // ranking of the certainty of the match
      properties: {
        // additonal info like specific address components like Country Code ect...
      }
    }
  ]
}
```


## L.esri.Geocoding.Tasks.Suggest

### Constructor

Constructor | Description
--- | ---
`new L.esri.Geocoding.Tasks.Suggest(options)`<br>`L.esri.Geocoding.Tasks.suggest(options)` | Creates a new Suggest task using the ArcGIS World Geocoder.

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`text(text <String>)` | `this` | The text to recive suggestions for.
`category(category <String>)` | The category to search for suggestions. By default no categogy. A list of categories can be found [here](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-category-filtering.htm#ESRI_SECTION1_502B3FE2028145D7B189C25B1A00E17B)
`within(bounds <L.LatLngBounds>)` | A bounding box to search for suggestions in.
`nearby(latlng <L.LatLng>, distance <Integer>)` | Searches for suggestions only inside an area around the LatLng. `distance` is in meters.
`run(callback <Function>, context<Object>)` | `XMLHttpRequest` | Executes this request chain and accepts the response callback.

### Example

```js
L.esri.Geocoding.Tasks.suggest().text('trea').nearby([45,-121], 5000).run(function(error, response){
  // response matches the suggest API response https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm#ESRI_SECTION1_FC3884A45AD24E62BD11C9888F1392DB
});
```

## L.esri.Geocoding.Tasks.ReverseGeocode

### Constructor

Constructor | Description
--- | ---
`new L.esri.Geocoding.Tasks.ReverseGeocode(options)`<br>`L.esri.Geocoding.Tasks.reverseGeocode(options)` | Creates a new ReverseGeocode task. `L.esri.Geocoding.WorldGeocodingService` can be used as a reference to the ArcGIS Online World Geocoder.

### Options

You can pass any options you can pass to L.esri.Tasks.Task. `url` will be the ArcGIS World Geocoder by default but a custom geocoding service can also be used.

### Methods

Method | Returns | Description
--- | --- | ---
`latlng(latlng <L.LatLng>)` | The L.LatLng object for which the address will be looked up.
`distance(distance <Integer>)` | The distance (in meters) around the point for which addresses will be looked up.
`language(language <String>)` | `this` | The language to return the address in.
`run(callback <Function>, context <Object>)` | `XMLHttpRequest` | Executes this request chain and accepts the response callback.

### Example

```js
L.esri.Geocoding.Tasks.reverseGeocode().latlng([48.8583,  2.2945]).run(function(error, result, response){
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

## Dependencies

Esri Leaflet Geocoder relies on the minimal Esri Leaflet Core which handles abstraction for requests and authentication when neccessary. You can find out more about the Esri Leaflet Core from the [Esri Leaflet Quickstart](http://esri.github.io/esri-leaflet/examples/).

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
4. If you use this library in a revenue generating application or for goverment use you must upgrade to a paid account. You are not allowed to generate revenue while on a free plan.

This information is from the [ArcGIS for Developers Terms of Use FAQ](https://developers.arcgis.com/en/terms/faq/) and the [ArcGIS Online World Geocoder documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)

## Licensing
Copyright 2013 Esri

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
