var gulp = require('gulp');
var dutil = require('./doc-util');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var cssnano = require('cssnano');
var packCSS = require('css-mqpacker');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var gulpStylelint = require('gulp-stylelint');
const { formatters } = require('stylelint');
var pkg = require('../../package.json');
var path = require('path');
var filter = require('gulp-filter');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');
var del = require('del');
var task = 'sass';
var autoprefixerOptions = require('./browsers');
var path = require('path');

var entryFileFilter = filter('portfolio.scss', { restore: true });
var normalizeCssFilter = filter('normalize.css', { restore: true });

const IGNORE_STRING = 'This file is ignored';
const ignoreStylelintIgnoreWarnings = lintResults =>
  formatters.string(
    lintResults.reduce((memo, result) => {
      const { warnings } = result;
      const fileIsIgnored = warnings.some((warning) => {
        return RegExp(IGNORE_STRING, 'i').test(warning.text);
      });

      if (!fileIsIgnored) {
        memo.push(result);
      }

      return memo;
    }, [])
  );

gulp.task('stylelint', () => {
  return gulp
    .src('./src/sass/**/*.scss')
    .pipe(gulpStylelint({
      failAfterError: true,
      reporters: [{
        formatter: ignoreStylelintIgnoreWarnings, console: true,
      }],
      syntax: 'scss',
    }))
    .on('error', dutil.logError);
});

gulp.task('copy-vendor-sass', function () {

  dutil.logMessage('copy-vendor-sass', 'Compiling vendor CSS');

  var stream = gulp.src([
    './node_modules/normalize.css/normalize.css',
    './node_modules/bourbon/app/assets/stylesheets/**/*.scss',
    './node_modules/bourbon-neat/app/assets/stylesheets/**/*.scss',
  ])
    .pipe(normalizeCssFilter)
    .pipe(rename('_normalize.scss'))
    .pipe(normalizeCssFilter.restore)
    .on('error', function (error) {
      dutil.logError('copy-vendor-sass', error);
    })
    .pipe(gulp.dest('src/sass/lib'));

  return stream;
});

gulp.task('copy-src-css', function () {
  dutil.logMessage('copy-src-css', 'Copying all CSS to dist dir');

  var stream = gulp.src([
    'src/css/**/*.css',
    'src/css/**/*.css.map',
  ])
    .pipe(gulp.dest('_dist/css'));

  return stream;
});

gulp.task('sass-build', function() {
  dutil.logMessage(task, 'Compiling Sass into CSS');

  var plugins = [
    autoprefixer(autoprefixerOptions),
    packCSS({ sort: true }),
    cssnano(({ autoprefixer: { browsers: autoprefixerOptions }}))
  ];

  var stream = gulp.src('src/sass/portfolio.scss')
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
        .on('error', sass.logError)
    )
    .pipe(postcss(plugins))
    .pipe(gulp.dest('src/css'))
    .pipe(rename({
      suffix: '.min',
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('src/css'));

  return stream;
});

gulp.task('sass', function(callback) {
  runSequence('copy-vendor-sass', 'sass-build', 'copy-src-css', callback);
});

gulp.task('sass-rebuild', function(callback) {
  runSequence('sass-build', 'copy-src-css', 'browsersync:reload', callback);
});
