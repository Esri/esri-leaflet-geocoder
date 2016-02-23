import uglify from 'rollup-plugin-uglify';
import config from './base.js'

config.dest = 'dist/esri-leaflet-geocoder.js';
config.sourceMap = 'dist/esri-leaflet-geocoder.js.map';
config.plugins.push(uglify());

export default config;