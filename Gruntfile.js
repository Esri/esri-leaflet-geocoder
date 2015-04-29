var fs = require('fs');

module.exports = function(grunt) {
  var browsers = grunt.option('browser') ? grunt.option('browser').split(',') : ['PhantomJS'];

  var umdHeader = '(function (factory) {\n' +
                  '  // define an AMD module that relies on \'leaflet\'\n' +
                  '  if (typeof define === \'function\' && define.amd) {\n' +
                  '    define([\'leaflet\', \'esri-leaflet\'], function (L, Esri) {\n' +
                  '      return factory(L, Esri);\n' +
                  '    });\n' +
                  '\n' +
                  '  // define a common js module that relies on \'leaflet\'\n' +
                  '  } else if (typeof module === \'object\' && typeof module.exports === \'object\') {\n' +
                  '    module.exports = factory(require(\'leaflet\'), require(\'esri-leaflet\'));\n' +
                  '  }\n' +
                  '\n' +
                  '  // define globals if we can find the proper place to attach them to.\n' +
                  '  if(typeof window !== \'undefined\' && window.L && window.L.esri) {\n' +
                  '    factory(L, L.esri);\n' +
                  '  }\n' +
                  '\n' +
                  '}(function (L, Esri) {\n';

  var umdFooter = '\n\n  return EsriLeafletGeocoding;\n'+
                  '}));\n';

  var copyright = '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                   '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
                   '*   Apache 2.0 License ' +
                   '*/\n\n';

  var files = [
    'src/EsriLeafletGeocoding.js',
    'src/Tasks/**/*.js',
    'src/Services/**/*.js',
    'src/Controls/**/*.js',
    'src/Providers/**/*.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: [
          'src/**/*.js'
        ]
      }
    },

    concat: {
      options: {
        sourceMap: true,
        separator: '\n\n',
        banner: copyright + umdHeader,
        footer: umdFooter
      },
      js: {
        src: files,
        dest: 'dist/esri-leaflet-geocoder-src.js'
      },
      css: {
        options: {
          banner: '',
          footer: ''
        },
        src: [
          'src/esri-leaflet-geocoder.css'
        ],
        dest: 'dist/esri-leaflet-geocoder-src.css'
      }
    },

    uglify: {
      options: {
        wrap: false,
        mangle: {
          except: ['L']
        },
        preserveComments: 'some',
        banner: copyright + umdHeader,
        footer: umdFooter,
        sourceMap: true,
        sourceMapIncludeSources: true,
      },
      dist: {
        files: {
          'dist/esri-leaflet-geocoder.js': files
        }
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['img/*.{png,jpg,gif}'],
          dest: 'dist/'
        }]
      }
    },

    cssmin: {
      main: {
        options: {
          wrap: false,
          preserveComments: 'some'
        },
        files: {
          'dist/esri-leaflet-geocoder.css': [
            'dist/esri-leaflet-geocoder-src.css'
          ]
        }
      }
    },

    s3: {
      options: {
        key: '<%= aws.key %>',
        secret: '<%= aws.secret %>',
        bucket: '<%= aws.bucket %>',
        access: 'public-read',
        headers: {
          // 1 Year cache policy (1000 * 60 * 60 * 24 * 365)
          "Cache-Control": "max-age=630720000, public",
          "Expires": new Date(Date.now() + 63072000000).toUTCString()
        }
      },
      dev: {
        upload: [
          {
            src: 'dist/*',
            dest: 'esri-leaflet-geocoder/<%= pkg.version %>/'
          },
          {
            src: 'dist/img/*',
            dest: 'esri-leaflet-geocoder/<%= pkg.version %>/img'
          }
        ]
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      run: {
        reporters: ['progress'],
        browsers: browsers
      },
      coverage: {
        reporters: ['progress', 'coverage'],
        browsers: browsers,
        preprocessors: {
          'src/**/*.js': 'coverage'
        }
      },
      watch: {
        singleRun: false,
        autoWatch: true,
        browsers: browsers
      }
    },

    releaseable: {
      release: {
        options: {
          remote: 'upstream',
          dryRun: grunt.option('dryRun') ? grunt.option('dryRun') : false,
          silent: false
        },
        src: ['dist/**/*']
      }
    }
  });

  var awsExists = fs.existsSync(process.env.HOME + '/esri-leaflet-s3.json');

  if (awsExists) {
    grunt.config.set('aws', grunt.file.readJSON(process.env.HOME + '/esri-leaflet-s3.json'));
  }

  grunt.registerTask('test', 'karma:run');
  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'test', 'concat', 'uglify', 'imagemin', 'cssmin']);
  grunt.registerTask('prepublish', ['concat', 'uglify', 'imagemin', 'cssmin']);
  grunt.registerTask('release', ['releaseable', 's3']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-s3');
  grunt.loadNpmTasks('grunt-releaseable');

};