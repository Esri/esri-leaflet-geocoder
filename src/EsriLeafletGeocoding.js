export { version as VERSION } from '../package.json';

// import tasks
export { Geocode, geocode } from './Tasks/Geocode';
export { ReverseGeocode, reverseGeocode } from './Tasks/ReverseGeocode';
export { Suggest, suggest } from './Tasks/Suggest';

// import service
export { GeocodeService, geocodeService } from './Services/Geocode';

// import control
export { Geosearch, geosearch } from './Controls/Geosearch';

// import supporting class
export { GeosearchCore, geosearchCore } from './Classes/GeosearchCore';

// import providers
export { ArcgisOnlineProvider, arcgisOnlineProvider } from './Providers/ArcgisOnlineGeocoder';
export { FeatureLayerProvider, featureLayerProvider } from './Providers/FeatureLayer';
export { MapServiceProvider, mapServiceProvider } from './Providers/MapService';
export { GeocodeServiceProvider, geocodeServiceProvider } from './Providers/GeocodeService';

export { WorldGeocodingServiceUrl } from './helper';
