/*jshint node:true*/

'use strict';

module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          includePaths: [
            require('node-bourbon').includePaths,
            'sass/',
            'components/sass'
          ],
          sourceMap: true
        },
        files: [
          {
            src: 'sass/base.scss',
            dest: 'css/base.css'
          },
          {
            src: 'sass/components.scss',
            dest: 'css/components.css'
          },
          {
            expand: true,
            cwd: 'sass/layouts/',
            src: '*.scss',
            dest: 'css/layouts/',
            ext: '.css'
          }
        ]
      }
    },
    autoprefixer: {
      options: {
        map: true, // Use and update the sourcemap
        browsers: ["last 3 versions"]
      },
      project_css: {
        expand: true,
        flatten: true,
        src: 'css/*.css',
        dest: 'css/'
      },
      layouts_css: {
        expand: true,
        flatten: true,
        src: 'css/layouts/*.css',
        dest: 'css/layouts/'
      }
    },
    concat: {
      js_base: {
        src: [
          'bower_components/modernizr/modernizr.js',
          'bower_components/jquery/dist/jquery.min.js',
        ],
        dest: 'js/project.js'
      },
      js_components: {
        src: 'js/components/*.js',
        dest: 'js/components.js'
      }
    },
    cssmin: {
      minify: {
        src: [
          'css/base.css',
          'css/components.css',
          'css/layouts/*.css'
        ],
        dest: 'css/portfolio.min.css'
      }
    },
    jshint: {
      jshintrc: true,
      all: [
        'Gruntfile.js',
        'js/components/*.js'
      ],
      gruntfile: 'Gruntfile.js'
    },
    browserSync: {
      dev: {
        files: {
          src : [
            '*.html',
            'case-study/*.html',
            'css/*.css',
            'css/*/*.css',
            'js/*.js',
            'js/components/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: './'
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
        max_jshint_notifications: 5, // maximum number of notifications from jshint output
        success: false // whether successful grunt executions should be notified automatically
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile']
      },
      scripts: {
        files: [
          'js/components/*.js'
        ],
        tasks: ['jshint:all', 'concat:js_components'],
        options: {
          debounceDelay: 250
        }
      },
      base_files: {
        files: [
          '*.html'
        ],
        tasks: ['sass']
      },
      base_styles: {
        files: [
          'sass/*.scss',
          'sass/*/*.scss'
        ],
        tasks: ['sass', 'cssmin', 'autoprefixer']
      }
    }
  });

  grunt.registerTask('dev', ['sass', 'autoprefixer', 'concat:js_components', 'browserSync', 'watch']);
  grunt.registerTask('css', ['cssmin']);
  grunt.registerTask('js', ['jshint:all', 'concat:js_base']);
  grunt.registerTask('build', ['css', 'js']);
};
