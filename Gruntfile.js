module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef:  true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          XMLHttpRequest: true,
          ActiveXObject: true,
          module: true,
          L:true
        }
      },
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
        '*/\n\n'
      },
      js: {
        src: [
          'src/esri-leaflet-geocoder.js'
        ],
        dest: 'dist/esri-leaflet-geocoder-src.js'
      },
      css: {
        src: [
          'src/esri-leaflet-geocoder.css'
        ],
        dest: 'dist/esri-leaflet-geocoder-src.css'
      }
    },
    uglify: {
      options: {
        wrap: false,
        preserveComments: 'some',
        report: 'gzip'
      },
      dist: {
        files: {
          'dist/esri-leaflet-geocoder.js': [
            'dist/esri-leaflet-geocoder-src.js'
          ]
        }
      }
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/',                   // Src matches are relative to this path
          src: ['img/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'dist/img'                  // Destination path prefix
        }]
      }
    },
    cssmin: {
      main: {
        options: {
          wrap: false,
          preserveComments: 'some',
          report: 'gzip'
        },
        files: {
          'dist/esri-leaflet-geocoder.css': [
            'dist/esri-leaflet-geocoder-src.css'
          ]
        }
      }
    }

  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'imagemin', 'cssmin']);
  grunt.registerTask('test', ['karma:single']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

};