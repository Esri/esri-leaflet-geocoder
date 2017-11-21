# Changelog

## [Upcoming changes][Unreleased]

## [2.2.8] - 2017-11-21

* `/img` folder was missing in last npm release
* found fix to ensure we no longer have rogue missing files (hopefuly)

###


## [2.2.7] - 2017-11-21

### Fixed

* enable touch selection for results [#186](https://github.com/Esri/esri-leaflet-geocoder/issues/186)
* formatted display text bug [`d5de54b`](https://github.com/Esri/esri-leaflet-geocoder/commit/d5de54b12f9b17e11c46db8d6cea767190420a2e)

## [2.2.6] - 2017-07-27

### Fixed

* `esri-leaflet-geocoder.js` file was missing in last npm release

## [2.2.5] - 2017-07-27

### Changed

* stop including L.Mixin.Events [#180](https://github.com/Esri/esri-leaflet-geocoder/issues/180)

### Fixed

* ensure custom geocoding param names are fetched/used when suggestion support is present [#182](https://github.com/Esri/esri-leaflet-geocoder/issues/182)
* ensure `magicKey`s are passed through to custom geocoding services [#182](https://github.com/Esri/esri-leaflet-geocoder/issues/182)
* ensure tests don't `new` up their objects

## [2.2.4] - 2017-03-22

### Fixed

* minor CSS issue on browsers that support touch
* the `findAddressCandidates` operation of geocoding services is now used exclusively, rather than alternating back and forth with `find`
* geocode and search requests are no longer fired when enter is pressed without supplying input text

## [2.2.3] - 2017-01-06

### Fixed

* geosearch control display size is now appropriate in browsers that support touch input (like Chrome 55+ and IE11/Edge)
* Correct results are now returned when a `featureLayerProvider` search is instantiated *after* executing a previous search that failed to return a single candidate.
* a solid gray line is no longer displayed underneath the geosearch control when no candidates were returned by a service.
* display text is now aligned correctly on devices that support touch input

## [2.2.2] - 2016-12-18

### Fixed
* Now all user supplied geosearch constructor options are applied correctly when the default provider is used.

## [2.2.1] - 2016-11-22

### Fixed
* Duplicate `featureLayerProvider` suggestions with identical display text are no longer displayed.  When more than one feature with identical suggestion text is returned, all are now available in the callback.

* Correct results are now returned when a `featureLayerProvider` search is instantiated by hitting `enter` *after* a previous search result was selected from the list.

## [2.2.0] - 2016-11-06

### Added

* It is now possible to declare the desired sort order for geosearch results from a `featureLayerProvider`. the new method operates identically to `L.esri.query.orderBy()`

```js
var flProvider = L.esri.Geocoding.featureLayerProvider({
  label: 'States',
  url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3',
  searchFields: ['STATE_NAME']
})

// fieldname + ascending/descending flag
flProvider.orderBy('POP2007', 'ASC')
```

### Fixed

* `mapServiceProvider` text search is now slightly *fuzzier*. [#149](https://github.com/Esri/esri-leaflet-geocoder/pull/149)  thx [@nickpeihl](https://github.com/nickpeihl)!

* `npm start` now launches a web server and recompiles the built source when a change is detected on Windows boxes as well. [#156](https://github.com/Esri/esri-leaflet-geocoder/pull/156) thx [@gavinr](https://github.com/gavinr)!

* Placeholder text is now display immediately when the geosearch control is configured to be expanded on page load. [#157](https://github.com/Esri/esri-leaflet-geocoder/pull/157)

## [2.1.4] - 2016-09-21

### Fixed

* the loading icon is now cleared when a search returns no results [#142](https://github.com/Esri/esri-leaflet-geocoder/pull/142)
* sub queries are now concatenated correctly when a filter is applied to the `FeatureLayer` being searched. [#144](https://github.com/Esri/esri-leaflet-geocoder/pull/144)

## [2.1.3] - 2016-09-15

### Fixed

* botched the last npm release

## [2.1.2] - 2016-09-15

### Fixed

* 'Powered by Esri' is now displayed in map attribution when the ArcGIS Online World Geocoding service is used in geosearch instead of 'Geocoding by Esri' [#134](https://github.com/Esri/esri-leaflet-geocoder/pull/134)

### Added
* We now expose a `where` constructor parameter for featureLayerProvider so that developers can filter features which will be matched to user searches. [#136](https://github.com/Esri/esri-leaflet-geocoder/pull/136)

* The geosearch control now utilizes the `arcgisOnlineProvider` by default if no provider is specified in the object constructor. [#137](https://github.com/Esri/esri-leaflet-geocoder/pull/137)

## [2.1.1] - 2016-07-25

### Fixed

* ensure that setting `maxResults` limits the number of suggestions provided by `L.esri.Geocoding.geosearch`, not just final results [#124](https://github.com/Esri/esri-leaflet-geocoder/pull/124)

* trap situation in which geocoding service returns more than one candidate even though request includes a `magicKey` [#129](https://github.com/Esri/esri-leaflet-geocoder/pull/129)

* improved support for custom Esri geocoding services in `geosearch` [#124](https://github.com/Esri/esri-leaflet-geocoder/pull/124)

## [2.1.0] - 2016-04-29

### Added

* new `enable()` and `disable()` methods to programmatically control `geosearch`. [./pull/121](https://github.com/Esri/esri-leaflet-geocoder/pull/121)

### Fixed

* ensure that the map is zoomed to the bounding box of matches, not street level. [./pull/123](https://github.com/Esri/esri-leaflet-geocoder/pull/123)
* made sure Esri's copyright text is included in the concatenated, minified build of the library. ae9dea4
* changed a string introspection to make grumpy old IE happy. [pull/127](https://github.com/Esri/esri-leaflet-geocoder/pull/127)

### Changed

* Build system refactored to use latest Rollup and Rollup plugins.
* Reworked bundling directives for various modules systems to resolve and simplify various issues
  * WebPack users no longer have to use the Babel loader.
  * Babelify with Babel 6 now works
* refactored `geosearch` into a base class and inherited control to lay the groundwork for other UI components that live outside the map. [pull/102](https://github.com/Esri/esri-leaflet-geocoder/pull/102)
* use `https` consistently when making requests to the World Geocoding services instead of inheriting protocol from the parent application. 388ba04

## [2.0.3] - 2016-01-27

### Added

* new `searchBounds` parameter for `L.esri.Geocoding.geosearch` for filtering using a static bounding box. (#115 thanks to @nathanhilbert!)

## [2.0.2] - 2015-12-03

### Fixed

* appropriate l18n input parameter is now passed in `reverseGeocode` requests
* made sure appropriate provider attribution is added to the map

## [2.0.1] - 2015-09-24

### Fixed

* ensured that options from Geosearch constructor are mixed in correctly.

## [2.0.0] - 2015-09-08

### Added

* implemented a new 'countries' parameter for the `arcgisOnlineProvider` based on new capabilities of the [World Geocoding Service](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm) #38
* implemented a new 'categories' parameter for the `arcgisOnlineProvider` based on new capabilities of the [World Geocoding Service](https://developers.arcgis.com/rest/geocode/api-reference/overview-world-geocoding-service.htm)
* added the ability to include 'categories' in requests using `L.esri.Geocoding.suggest`
* updated result objects across providers to include the actual GeoJSON of candidates #81

### Fixed

* included additional logic to ensure that queries are case insensitive #83 (thanks @rntdrts)
* refactored the calculation of result bounds calculation to avoid uncaught exceptions and usage of `new` #84

## [2.0.0-beta.3]

### Fixed

* Missing files in NPM release.

## [2.0.0-beta.2]

### Fixed

* Missing sourcemap in build.

## [2.0.0-beta.1]

### Breaking

* Requires the 2.0.0-beta.4 release of Esri Leaflet.
* Require the 1.0.0-beta.1 release of Leaflet.
* Namespaces have changed all exports now sit directly under the `L.esri.Geocoding` namespace. This mean that things like `L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer` can now be accessed like `L.esri.Geocoding.FeatureLayerProvider`.
* `useArcgisWorldGeocoder` has been removed. Now you must pass `L.esri.Geocoding.arcGisOnlineProvider()` in the `providers` array. This will facilitate easily passing options to the ArcGIS Online geocoder.

### Added

* Better build/test/release automation.
* Support for JSPM in package.json. Now you can `import geocode from 'esri-leaflet-geocoder/src/Tasks/Geocoder';` for more compact builds but, be aware of [caveats](http://blog.izs.me/post/44149270867/why-no-directories-lib-in-node-the-less-snarky)
* Support for browserify in the package.json. Now you can `var geocode = require('esri-leaflet-geocoder/src/Tasks/Geocoder');` for more compact builds, but be aware of [caveats](http://blog.izs.me/post/44149270867/why-no-directories-lib-in-node-the-less-snarky)

## [1.0.2]

* Fix bug in Suggest logic affecting older versions of ArcGIS Server (#77)

## [1.0.1]

* Fix incorrect version number in built files.

## [1.0.0]

This represents the stable release of Esri Leaflet Geocoder compatible with Leaflet 0.7.3. All future 1.0.X releases will be compatible with Leaflet 0.7.3 and contain only bug fixes. New features will only be added in Esri Leaflet Geocoder 2.0.0 which will require Leaflet 1.0.0.

### Changes

* Introduced support for dynamic suggestions from custom geocoding services. #65
* Refactored code to account for changes introduced in Esri Leaflet `1.0.0`. #75
* Fixed problem in `initialize` #63 (thanks @timwis!)
* Plugin now dynamically sets a hard search extent when `useMapBounds` is set to true. #58

## Release Candidate 3

### Breaking Changes

* Providers should now supply their `url` with the `url` key inside of `options` as opposed to a separate parameter.
* Namespace has been reorganized. everything now sits under `L.esri.Geocoding`. So `L.esri.Tasks.Geocode` is now `L.esri.Geocoding.Tasks.Geocode`.

### Changes

* `MapService` provider now supports being passed an array of layers to search. https://github.com/Esri/esri-leaflet-geocoder/issues/48
* `title` option will now set the title on the input to `'Location Search'` by default. https://github.com/Esri/esri-leaflet-geocoder/pull/51
* When using many providers or when a provider returns lots of results with a high limit, the suggestions div will now scroll. https://github.com/Esri/esri-leaflet-geocoder/issues/55
* `within()` and `nearby()` now return the task and can be changed. https://github.com/Esri/esri-leaflet-geocoder/pull/49
* Bugfix for `MapService` provider https://github.com/Esri/esri-leaflet-geocoder/issues/46

## Release Candidate 2

### Changes

* Bower support `bower install esri-leaflet-geocoder`
* Update Esri Leaflet dependency to RC 3

## Release Candidate 1

Please read through the docs and changes list carefully. There has been a major refactoring.

** Breaking Changes **

* Namespacing has changed. All methods and classes are now under `L.esri.Geocoding`. `L.esri.Geocoding` organizes everything into `Controls`, `Services`, and `Tasks`.
* `GeocodeService` has been rewritten from scratch to mirror the Esri Leaflet service style that returns tasks.
* `GeocodeService.suggest`, `GeocodeService.geocode` and `GeocodeService.reverse` all return their respective tasks.

** Changes **

* New tasks for `Suggest`, `Geocode` and `ReverseGeocode` that mirror the Esri Leaflet task structure.
* `L.esri.Geocoding.Controls.Geosearch` can now search multiple providers.
* Available on NPM and Bower
* Wrapped as a CommonJS module
* Wrapped as an AMD module
* Basic unit tests
* TravisCI support
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
* Now that `L.esri.Services.Geocoder` extends on `L.esri.Services.Service` you can pass the `forStorage` flag with any call and authenticate. Listen for the `authenticationrequired` event and provide a token or pass a `token` option.

## Beta 3

* Fix style to accommodate `topright` position
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

* Initial alpha release

[Unreleased]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.8...HEAD
[2.2.8]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.7...v2.2.8
[2.2.7]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.6...v2.2.7
[2.2.6]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.5...v2.2.6
[2.2.5]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.4...v2.2.5
[2.2.4]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.3...v2.2.4
[2.2.3]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.3...v2.2.2
[2.2.2]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.2...v2.2.1
[2.2.1]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.1...v2.2.0
[2.2.0]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.2.0...v2.1.4
[2.1.4]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.1.3...v2.1.4
[2.1.3]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.1.2...v2.1.3
[2.1.2]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.1.1...v2.1.2
[2.1.1]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.1.0...v2.1.1
[2.1.0]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.3...v2.1.0
[2.0.3]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.2...v2.0.3
[2.0.2]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.0-beta.3...v2.0.0
[2.0.0-beta.3]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.0-beta.2...v2.0.0-beta.3
[2.0.0-beta.2]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.0-beta.2...v2.0.0-beta.3
[2.0.0-beta.1]: https://github.com/Esri/esri-leaflet-geocoder/compare/v2.0.0-beta.2...v2.0.0-beta.3
[1.0.2]: https://github.com/Esri/esri-leaflet-geocoder/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/Esri/esri-leaflet-geocoder/compare/v1.0.1...v1.0.2
[1.0.0]: https://github.com/Esri/esri-leaflet-geocoder/compare/v1.0.0...v1.0.2
