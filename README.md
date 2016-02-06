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
    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet/v1.0.0-beta.2/leaflet.js"></script>
    <!-- Esri Leaflet -->
    <script src="//cdn.jsdelivr.net/leaflet.esri/2.0.0-beta.7/esri-leaflet.js"></script>
    <!-- Esri Leaflet Geocoder -->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/leaflet.esri.geocoder/2.0.3/esri-leaflet-geocoder.css">
    <script src="//cdn.jsdelivr.net/leaflet.esri.geocoder/2.0.3/esri-leaflet-geocoder.js"></script>
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
        }
    });
    </script>
</body>
</html>
```

# API Reference

## Controls

### [`L.esri.Geocoding.geosearch`](http://esri.github.io/esri-leaflet/api-reference/controls/geosearch.html)
a control for auto-complete enabled search

## Services

### [`L.esri.Geocoding.geocodeService`](http://esri.github.io/esri-leaflet/api-reference/services/geocode-service.html)
A basic wrapper for ArcGIS Online geocoding services. Used internally by `L.esri.Geocoding.geosearch`.

## Tasks

### [`L.esri.Geocoding.geocode`](http://esri.github.io/esri-leaflet/api-reference/tasks/geocode.html)
An abstraction for submitting requests to turn addresses into locations.

### [`L.esri.Geocoding.suggest`](http://esri.github.io/esri-leaflet/api-reference/tasks/suggest.html)
An abstraction for submitting requests for geocoding suggestions.

### [`L.esri.Geocoding.reverseGeocode`](http://esri.github.io/esri-leaflet/api-reference/tasks/reverse-geocode.html)
An abstraction for submitting requests for address candidates associated with a particular location.

## Development Instructions

1. [Fork and clone Esri Leaflet Geocoder](https://help.github.com/articles/fork-a-repo)
2. `cd` into the `esri-leaflet-geocoder` folder
5. Install the dependencies with `npm install`
5. The example at `/index.html` *should* 'just work'
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
