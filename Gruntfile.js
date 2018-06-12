/*jshint node:true*/

'use strict';

module.exports = function(grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      jekyllBuild: {
        command: 'bundle exec jekyll build'
      },
      jekyllServe: {
        command: "bundle exec jekyll serve --baseurl ''"
      }
    },
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
            src: 'sass/base.scss',
            dest: '_site/css/base.css'
          },
          {
            src: 'sass/components.scss',
            dest: 'css/components.css'
          },
          {
            src: 'sass/components.scss',
            dest: '_site/css/components.css'
          },
          {
            expand: true,
            cwd: 'sass/layouts/',
            src: '*.scss',
            dest: 'css/layouts/',
            ext: '.css'
          },
          {
            expand: true,
            cwd: 'sass/layouts/',
            src: '*.scss',
            dest: '_site/css/layouts/',
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
    uglify: {
      options: {
        mangle: false
      },
      js_base: {
        files: {
          'js/project.min.js': [
            'bower_components/modernizr/modernizr.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/picturefill/dist/picturefill.js'
          ]
        }
      }
    },
    concat: {
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
            '_site/*.html',
            '_site/css/*.css',
            '_site/css/*/*.css',
            '_site/js/*.js',
            '_site/js/components/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: '_site'
          }
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
      jekyll: {
        files: [
          '*.html',
          '_layouts/*.html',
          '_includes/*.md',
          'case-study/*.html'
        ],
        tasks: ['jekyll']
      },
      base_styles: {
        files: [
          'sass/*.scss',
          'sass/*/*.scss'
        ],
        tasks: ['css']
      }
    },
    // run tasks in parallel
    concurrent: {
      serve: [
        'css',
        'watch',
        'shell:jekyllServe'
      ],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.registerTask('serve', ['browserSync', 'concurrent:serve']);
  grunt.registerTask('build', ['shell:jekyllBuild', 'css', 'js']);
  grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);
  grunt.registerTask('js', ['jshint:all', 'concat:js_components', 'uglify:js_base']);

  // Register build as the default task fallback
  grunt.registerTask('default', 'serve');
};
