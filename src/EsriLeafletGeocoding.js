export var VERSION = '2.0.2';
export var WorldGeocodingServiceUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';

// import tasks
export { Geocode, geocode } from './Tasks/Geocode';
export { ReverseGeocode, reverseGeocode } from './Tasks/ReverseGeocode';
export { Suggest, suggest } from './Tasks/Suggest';

// import service
export { GeocodeService, geocodeService } from './Services/Geocode';

// import control
export { Geosearch, geosearch } from './Controls/Geosearch';

// import providers
export { ArcgisOnlineProvider, arcgisOnlineProvider } from './Providers/ArcgisOnlineGeocoder';
export { FeatureLayerProvider, featureLayerProvider } from './Providers/FeatureLayer';
export { MapServiceProvider, mapServiceProvider } from './Providers/MapService';
export { GeocodeServiceProvider, geocodeServiceProvider } from './Providers/GeocodeService';
