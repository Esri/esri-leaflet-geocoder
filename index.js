// export tasks
export { Geocode, geocode } from './Tasks/Geocode.js';
export { ReverseGeocode, reverseGeocode } from './Tasks/ReverseGeocode.js';
export { Suggest, suggest } from './Tasks/Suggest.js';

// export service
export { GeocodeService, geocodeService } from './Services/Geocode.js';

// export control
export { Geosearch, geosearch } from './Controls/Geosearch.js';

// export providers
export { ArcgisOnlineProvider, arcgisOnlineProvider } from './Providers/ArcgisOnlineGeocoder.js';
export { FeatureLayerProvider, featureLayerProvider} from './Providers/FeatureLayer.js';
export { MapServiceProvider, mapServiceProvider} from './Providers/MapService.js';
export { GeocodeServiceProvider, geocodeServiceProvider} from './Providers/GeocodeService.js';
