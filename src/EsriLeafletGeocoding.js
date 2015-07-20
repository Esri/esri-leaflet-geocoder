// import tasks
import { Geocode, geocode } from './Tasks/Geocode.js';
import { ReverseGeocode, reverseGeocode } from './Tasks/ReverseGeocode.js';
import { Suggest, suggest } from './Tasks/Suggest.js';

// import service
import { GeocodeService, geocodeService } from './Services/Geocode.js';

// import control
import { Geosearch, geosearch } from './Controls/Geosearch.js';

// import providers
import { ArcgisOnlineProvider, arcgisOnlineProvider } from './Providers/ArcgisOnlineGeocoder.js';
import { FeatureLayerProvider, featureLayerProvider} from './Providers/FeatureLayer.js';
import { MapServiceProvider, mapServiceProvider} from './Providers/MapService.js';
import { GeocodeServiceProvider, geocodeServiceProvider} from './Providers/GeocodeService.js';

// export everything
export var WorldGeocodingServiceUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';

export var Tasks = {
  Geocode: Geocode,
  geocode: geocode,
  ReverseGeocode: ReverseGeocode,
  reverseGeocode: reverseGeocode,
  Suggest: Suggest,
  suggest: suggest
};

export var Services = {
  GeocodeService: GeocodeService,
  geocodeService: geocodeService
};

export var Controls = {
  Geosearch: Geosearch,
  geosearch: geosearch
};

export var Providers = {
  ArcgisOnlineProvider: ArcgisOnlineProvider,
  arcgisOnlineProvider: arcgisOnlineProvider,
  FeatureLayerProvider: FeatureLayerProvider,
  featureLayerProvider: featureLayerProvider,
  MapServiceProvider: MapServiceProvider,
  mapServiceProvider: mapServiceProvider,
  GeocodeServiceProvider: GeocodeServiceProvider,
  geocodeServiceProvider: geocodeServiceProvider
};

// if we are in amd/cjs/es module land we wont declare a global so declare one here
var _isAmd = (typeof define === 'undefined') ? false : define.amd && typeof define === 'function';
var _isCjs = (typeof exports === 'object') && (typeof module !== 'undefined');
var _isSystem = window && window.System;

if ((_isAmd || _isCjs || _isSystem) && window && window.L && window.L.esri) {
  window.L.esri.Geocoding = {
    Tasks: Tasks,
    Services: Services,
    Controls: Controls,
    Providers: Providers
  };
}
