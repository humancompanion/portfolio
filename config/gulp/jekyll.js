var gulp        = require('gulp');
var cp          = require('child_process');
// var browsersync = require('browser-sync');
var dutil       = require('./doc-util');
var runSequence = require('run-sequence');
var task        = 'jekyll';


// Build Jekyll site
gulp.task('jekyll', function(done) {
  dutil.logMessage(task, 'Compiling Jekyll');

  return cp.spawn('bundle', ['exec', 'jekyll', 'build'], { stdio: 'inherit' })
  .on('close', done);
});

// Rebuild Jekyll site
gulp.task('jekyll-rebuild', function(callback) {
  runSequence('jekyll', 'browsersync:reload', callback);
});
