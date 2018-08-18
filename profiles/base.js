import config from '../node_modules/esri-leaflet/profiles/base.js';

config.input = 'src/EsriLeafletGeocoding.js';
config.output.name = 'L.esri.Geocoding';
config.output.sourcemap = true;

export default config;
