/*jshint node:true, esversion: 6 */
"use strict";

const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync");
const cp = require("child_process");
const csso = require("postcss-csso");
// Import del as ESM using dynamic import
const discardComments = require("postcss-discard-comments");
const gulp = require("gulp");
const log = require("fancy-log");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");

const env = process.env.NODE_ENV || "prod";
const config = require("./config/gulp/config");

const autoprefixerOptions = config.browsers;
const browserSyncConfig = config.browsersync.development;
const watchConfig = config.watch;

function browserSync(done) {
  browsersync.init(browserSyncConfig);
  done();
}

// Reload task, that is used by jekyll-rebuild
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Clean assets - using rimraf instead of del for CommonJS compatibility
function clean() {
  const rimraf = require("rimraf");
  return new Promise((resolve, reject) => {
    rimraf("./_site/assets/", err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function css() {
  const pluginsProcess = [
    // Autoprefix
    autoprefixer(autoprefixerOptions),
    discardComments(),
  ];
  const pluginsMinify = [csso({ forceMediaMerge: false })];

  return gulp
    .src(["_scss/portfolio.scss", "_scss/portfolio-print.scss"])
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(
      sass({
        includePaths: ["_scss"],
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(postcss(pluginsProcess))
    .pipe(gulp.dest("assets/css"))
    .pipe(gulp.dest("_site/assets/css"))
    .pipe(postcss(pluginsMinify))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("assets/css"))
    .pipe(gulp.dest("_site/assets/css"));
}

function jekyll(done) {
  log("Running buildJekyll");

  if (env === "prod") {
    log("Building for production");
    return cp
      .spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" })
      .on("close", done);
  } else {
    log("Building for development");
    return cp
      .spawn(
        "bundle",
        ["exec", "jekyll", "build", "--config", "_config.yml,_config-dev.yml"],
        { stdio: "inherit" }
      )
      .on("close", done);
  }
}

function watchFiles() {
  gulp.watch(watchConfig.jekyll, gulp.series(jekyll, browserSyncReload));
  gulp.watch(watchConfig.styles, gulp.series(css, browserSyncReload));
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(css, jekyll));
const watch = gulp.parallel(watchFiles, browserSync);

// Export tasks
exports.css = css;
exports.jekyll = jekyll;
exports.build = build;
exports.watch = watch;
exports.default = build;
