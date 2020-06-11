// Paths
//
var build             = '_site';

module.exports = {
  browsers: ["> 2%", "Last 2 versions"],
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
      '_data/**/*.{json,yml,csv}',
      '_includes/**/*.html',
      '_layouts/*.html',
      'pages/**/*.{html,markdown,md,yml,json,txt,xml}'
    ],
    styles: [
      '_scss/*.scss',
      '_scss/components/*.scss',
      '_scss/layouts/*.scss'
    ]
  },

  // Jekyll
  jekyll: {
    development: {
      config: '_config.yml,_config-dev.yml'
    }
  }
};
