# Changelog

## Release Candidate 1

Please read throught the docs and changes list carefully. There has been a major refactoring.

** Breaking Changes **

* Namespacing has changed. All methods and classes are now under `L.esri.Geocoding`. `L.esri.Geocoding` organizes everything into `Controls`, `Services`, and `Tasks`.
* `GeocodeService` has been rewritten from scrath to mirror the Esri Leaflet service style that returns tasks.
* `GeocodeService.suggest`, `GeocodeService.geocode` and `GeocodeService.reverse` all return their respective tasks.

** Changes **

* New tasks for `Suggest`, `Geocode` and `ReverseGeocode` that mirror the Esri Leaflet task structure.
* `L.esri.Geocoding.Controls.Geosearch` can now search multiple providers.
* Available on NPM and Bower
* Wrapped as a CommonJS module
* Wrapped as an AMD module
* Basic unit tests
* Source maps for compressed builds

## Beta 5

**Changes**
* Improve experience for users when they hit enter with no suggestion selected. The current test in the input will be geocoded and the map centered on the extent of all results. This behavior can be disabled by setting `allowMultipleResults` to `false`.
* Fix behavior of `useMapBounds` which was incorrect.
* Don't pass `bbox` with suggest. The suggest API doesn't use it.
* Increase `useMapBounds` default to `12`.

## Beta 4

**Breaking Changes**
* Esri Leaflet Geocoder now relies on the Esri Leaflet Core build, find out more on the [Esri Leaflet downloads page](http://esri.github.com/esri-leaflet/downloads).
* The callback signatures on `L.esri.Services.Geocoding`. The raw response is now the 3rd parameter and the second parameter is now a processed array of [Geocode Results](https://github.com/Esri/esri-leaflet-geocoder#geocode-results) or a[Reverse Geocode Results](https://github.com/Esri/esri-leaflet-geocoder#reverse-geocode-result) depending on the call.
* `L.esri.Services.Geocoding` no longer accepts the `outFields` parameter.

**Changes**
* Fix a display issues where the form would close but would not expand again. https://github.com/Esri/esri-leaflet-geocoder/issues/33
* Now that `L.esri.Services.Geocoder` extends on `L.esri.Services.Service` you can pass teh `forStorage` flag with any call and authenticate. Listen for the `authenticationrequired` event and provide a token or pass a `token` option.

## Beta 3

* Fix style to accomodate `topright` position
* Fix some leaflet-touch style issues

## Beta 2

* Fix bug in IE 10 and 11 on Windows 8 touch devices
 
## Beta 1

This is now ready for beta! This release helps finalize the API and includes lots of cross browser support.

## Alpha 2

**Breaking Changes**
* `result` and `results` events have been refactored into a single `results` event with and array of results.

**Changes**
* When the user hits enter without a suggestion selected their current text is geocoded within the current map bounds.
* Esri attribution added
* `error` event added

## Alpha 1

* Add the `allowMultipleResults` option. https://github.com/Esri/esri-leaflet-geocoder/issues/6

# Alpha

* Inital alpha release
