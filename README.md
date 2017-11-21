# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with the ArcGIS Online geocoding services.

[![npm version][npm-img]][npm-url]
[![build status][travis-img]][travis-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/esri-leaflet-geocoder/master/LICENSE)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/esri-leaflet-geocoder/badge)](https://www.jsdelivr.com/package/npm/esri-leaflet-geocoder)

[npm-img]: https://img.shields.io/npm/v/esri-leaflet-geocoder.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/esri-leaflet-geocoder
[travis-img]: https://img.shields.io/travis/Esri/esri-leaflet-geocoder/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Esri/esri-leaflet-geocoder

## Example

Take a look at the [live demo](http://esri.github.com/esri-leaflet/examples/geocoding-control.html).

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset=utf-8 />
    <title>Esri Leaflet Geocoder</title>
    <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />

    <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet-src.js"></script>

    <!-- Load Esri Leaflet from CDN -->
    <script src="https://unpkg.com/esri-leaflet@2.1.1"></script>

    <!-- Esri Leaflet Geocoder -->
    <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder@2.2.8/dist/esri-leaflet-geocoder.css">
    <script src="https://unpkg.com/esri-leaflet-geocoder@2.2.8"></script>

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
    var tiles = L.esri.basemapLayer("Streets").addTo(map);

    // create the geocoding control and add it to the map
    var searchControl = L.esri.Geocoding.geosearch().addTo(map);

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
2. `cd` into the `esri-leaflet-geocoder` folder and install the dependencies with `npm install`
3. Run `npm start` from the command line. This will compile minified source in a brand new `dist` directory, launch a tiny webserver and begin watching the raw source for changes.
4. The example at `debug/sample.html` *should* 'just work'
5. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Resources

* [Geocoding Service Documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)
* [ArcGIS for Developers](http://developers.arcgis.com)
* [ArcGIS REST Services](http://resources.arcgis.com/en/help/arcgis-rest-api/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

## Terms and Conditions

In order to make use of the ArcGIS Online World Geocoding Service in your web application:

1. Please sign up for an [ArcGIS for Developers account](https://developers.arcgis.com/en/plans) or purchase an [ArcGIS Online Organizational Subscription](http://www.arcgis.com/features/plans/pricing.html).
2. Ensure that `Powered by`[`Esri`](http://esri.com) is displayed in the map attribution.

## Cost

1. User search for individual locations within web applications is defined by Esri as *Geosearch* and it is free. [Credits](https://developers.arcgis.com/credits/) are only consumed when you store results permanently.
2. To store geocoding results, pass `forStorage: true` and a valid access token.
3. You are not allowed to generate revenue while on a free ArcGIS Developer plan.
4. If your application might generate more than 1 million searches in a month, please [contact us](http://www.esri.com/about-esri/contact).

* [ArcGIS for Developers Terms of Use FAQ](https://developers.arcgis.com/en/terms/faq/)
* [ArcGIS Online World Geocoder documentation](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Single_input_field_geocoding/02r300000015000000/)

## Licensing
Copyright 2017 Esri

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
