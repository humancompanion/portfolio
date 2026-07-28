# portfolio

This site collects my resume and some case studies of projects I have worked on. It is hosted by GitHub via github pages.

### Development Setup

Run ```npm run dev``` (alias ```npm start```) to work locally. It runs, in parallel:
* ```sass --watch``` — compiles ```_scss/``` into CSS on every change (expanded + source maps for debugging; these local files are gitignored)
* ```jekyll serve --livereload``` — builds the site and reloads the browser on change

### Building for production

```npm run build``` compiles the committed, compressed ```assets/css/*.min.css``` and runs ```jekyll build```. The compiled CSS is committed to the repo; GitHub Pages (main branch) rebuilds the Jekyll HTML and serves the committed CSS — no asset build runs at deploy, so a Sass error can never break a deploy (you catch it locally at compile time).

Note: there is no autoprefixer. IE 11 is unsupported; the modern-browser vendor prefixes that are still needed are authored directly in the SCSS mixins.
