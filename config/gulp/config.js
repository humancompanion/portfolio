// Paths
//
var src               = 'src';
var build             = '_dist';

module.exports = {

  // BrowserSync
  browsersync: {
    development: {
      server: {
        baseDir: [build]
      },
      port: 4000,
      notify: false
    }
  },

  // Watch source files
  watch: {
    jekyll: [
      '_config.yml',
      src + '/_data/**/*.{json,yml,csv}',
      src + '/_includes/**/*.{html}',
      src + '/_layouts/*.html',
      src + '/**/*.{html,markdown,md,yml,json,txt,xml}',
      src + '/*'
    ],
    styles: [
      src + '/**/*.scss',
      src + '/components/*.scss',
      src + '/layouts/*.scss'
    ]
  },

  // Jekyll
  jekyll: {
    development: {
      src:    src,
      dest:   build,
      config: '_config.yml'
    }
  },

};
