#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var rollup = require('rollup').rollup;
var UglifyJS = require('uglify-js');
var pkg = require('../package.json');

var copyright = '/* ' + pkg.name + ' - v' + pkg.version + ' - ' + new Date().toDateString() + '\n' +
                ' * Copyright (c) ' + new Date().getFullYear() + ' Environmental Systems Research Institute, Inc.\n' +
                ' * ' + pkg.license + ' */';

rollup({
  entry: path.resolve('src/EsriLeafletGeocoder.js'),
  external: ['leaflet', 'esri-leaflet']
}).then(function (bundle) {
  var transpiled = bundle.generate({
    format: 'umd',
    sourceMap: true,
    sourceMapFile: 'esri-leaflet-geocoder.js',
    moduleName: 'L.esri.geocoding'
  });

  var source_map = UglifyJS.SourceMap({
    file: 'esri-leaflet-geocoder.js',
    root: process.cwd(),
    orig: JSON.parse(transpiled.map)
  });

  var stream = UglifyJS.OutputStream({
    preamble: copyright,
    source_map: source_map
  });

  UglifyJS.parse(transpiled.code).print(stream);

  var code = stream.toString();
  var map = source_map.toString().replace(new RegExp(path.join(process.cwd(), 'src'), 'g'), '../src');

  fs.writeFileSync(path.join('dist', 'esri-leaflet-geocoder.js'), code + '\n//# sourceMappingURL=./esri-leaflet-geocoder.js.map');
  fs.writeFileSync(path.join('dist', 'esri-leaflet-geocoder.js.map'), map);
  process.exit(0);
}).catch(function (error) {
  console.log(error);
  process.exit(1);
});
