// Bring in individual Gulp configurations
require('./config/gulp/browser-sync');
require('./config/gulp/build');
require('./config/gulp/sass');
require('./config/gulp/jekyll');
require('./config/gulp/watch');

var gulp  = require('gulp');
var dutil = require('./config/gulp/doc-util');

gulp.task('default', function (done) {

  dutil.logIntroduction();

  dutil.logHelp(
    'gulp',
    'This task will output the currently supported automation tasks. (e.g. This help message.)'
  );

  dutil.logHelp(
    'gulp build',
    'This task is an alias for running `gulp sass javascript` and is the recommended task to build all assets.'
  );

  dutil.logCommand(
    'gulp sass',
    'This task will compile all the Sass (scss) files into distribution directories.'
  );

  dutil.logCommand(
    'gulp jekyll',
    'This task will compile all the HTML files into distribution directories.'
  );


  dutil.logCommand(
    'gulp test',
    'This task will run `gulp test` and run this repository\'s unit tests.'
  );

  done();

});
