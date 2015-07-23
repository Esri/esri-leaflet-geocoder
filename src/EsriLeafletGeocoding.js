export var WorldGeocodingServiceUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';

// import tasks
export { Geocode, geocode } from './Tasks/Geocode.js';
export { ReverseGeocode, reverseGeocode } from './Tasks/ReverseGeocode.js';
export { Suggest, suggest } from './Tasks/Suggest.js';

// import service
export { GeocodeService, geocodeService } from './Services/Geocode.js';

// import control
export { Geosearch, geosearch } from './Controls/Geosearch.js';

// import providers
export { ArcgisOnlineProvider, arcgisOnlineProvider } from './Providers/ArcgisOnlineGeocoder.js';
export { FeatureLayerProvider, featureLayerProvider} from './Providers/FeatureLayer.js';
export { MapServiceProvider, mapServiceProvider} from './Providers/MapService.js';
export { GeocodeServiceProvider, geocodeServiceProvider} from './Providers/GeocodeService.js';
