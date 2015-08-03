# portfolio

This site collects my resume and some case studies of projects I have worked on. It is hosted by GitHub via github pages.

### Development Setup

This site uses ```npm start``` to run the ```grunt dev``` task which will:
* Compile Sass into CSS, as well as autoprefix and minify the CSS
* Check the JS with jshint, then concat the libraries and project JS as well component JS
* Build the site using Jekyll
* Use Browser Sync to view the built site
* Watch for subsequent changes
