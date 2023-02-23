# Esri Leaflet Geocoder

The Esri Leaflet Geocoder is a small series of API helpers and UI controls to interact with the ArcGIS Online geocoding services.

[![npm version][npm-img]][npm-url]
[![apache licensed](https://img.shields.io/badge/license-Apache-green.svg?style=flat-square)](https://raw.githubusercontent.com/Esri/esri-leaflet-geocoder/master/LICENSE)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/esri-leaflet-geocoder/badge)](https://www.jsdelivr.com/package/npm/esri-leaflet-geocoder)

[npm-img]: https://img.shields.io/npm/v/esri-leaflet-geocoder.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/esri-leaflet-geocoder

## Example

Take a look at the [live demo](http://esri.github.com/esri-leaflet/examples/geocoding-control.html).

![Example Image](https://raw.github.com/esri/esri-leaflet-geocoder/master/example.png)

To run this demo, you need to replace 'YOUR_API_KEY' with your API key. If you do not have an account then sign up for free at [ArcGIS Developer](https://developers.arcgis.com/sign-up/).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Esri Leaflet Geocoder</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />

    <!-- Load Leaflet from CDN-->
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet/dist/leaflet-src.js"></script>

    <!-- Load Esri Leaflet from CDN -->
    <script src="https://unpkg.com/esri-leaflet"></script>

    <!-- Esri Leaflet Geocoder -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"
    />
    <script src="https://unpkg.com/esri-leaflet-geocoder"></script>

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
      var map = L.map("map").setView([45.5165, -122.6764], 12);
      var tiles = L.esri.basemapLayer("Streets").addTo(map);

      // create the geocoding control and add it to the map
      var searchControl = L.esri.Geocoding.geosearch({
        providers: [
          L.esri.Geocoding.arcgisOnlineProvider({
            // API Key to be passed to the ArcGIS Online Geocoding Service
            apikey: 'YOUR_API_KEY'
          })
        ]
      }).addTo(map);

      // create an empty layer group to store the results and add it to the map
      var results = L.layerGroup().addTo(map);

      // listen for the results event and add every result to the map
      searchControl.on("results", function (data) {
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
4. The example at `debug/sample.html` _should_ 'just work'
5. Make your changes and create a [pull request](https://help.github.com/articles/creating-a-pull-request)

## Resources

- [Geocoding Service Documentation](https://developers.arcgis.com/documentation/mapping-apis-and-services/search/services/geocoding-service/)
- [ArcGIS Developer](http://developers.arcgis.com)
- [ArcGIS REST services](https://developers.arcgis.com/rest/location-based-services/)
- [twitter@EsriGeoDev](https://twitter.com/EsriGeoDev)

## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/Esri/esri-leaflet/blob/master/CONTRIBUTING.md).

## Terms and Conditions

In order use the ArcGIS geocoding service you need the following:

1. An [ArcGIS Developer account](https://developers.arcgis.com/sign-up/) or [ArcGIS Online account](https://www.esri.com/en-us/arcgis/products/arcgis-online/trial).
2. If your application uses an basemap layer service or other Esri data, you must display`Powered by`[`Esri`](http://esri.com) in the map attribution. See [Basemap attribution](https://developers.arcgis.com/documentation/mapping-apis-and-services/deployment/basemap-attribution/) for more details.

## Not-stored vs stored geocodes

To determine if there is a cost associated with using the Esri Leaflet Geocoder and the ArcGIS geocoding service, if you have an ArcGIS Developer account, go to [Pricing](https://developers.arcgis.com/pricing/), or, if you have an ArcGIS Online account, go to [Credits by Capability](https://doc.arcgis.com/en/arcgis-online/administer/credits.htm#GUID-D309A4D0-43CD-4E58-A6DF-012A82A6D794).

Note: To store geocoding results, pass `forStorage: true` and a valid access token (see [Esri Leaflet Get Started](https://developers.arcgis.com/esri-leaflet/get-started/)).

- [ArcGIS Developer FAQ](https://developers.arcgis.com/faq/)
- [Esri Terms of Use](https://www.esri.com/en-us/legal/terms/full-master-agreement)
- [Complete ArcGIS geocode and search documentation](https://developers.arcgis.com/documentation/mapping-apis-and-services/search/)

## Licensing

Copyright &copy; 2013-2022 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [LICENSE](https://raw.github.com/Esri/esri-leaflet-geocoder/master/LICENSE) file.
