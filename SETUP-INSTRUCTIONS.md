# Portfolio Setup Instructions

These instructions will help you get your portfolio site running again with updated dependencies.

## Prerequisites

- Node.js (version 16 or higher)
- Ruby (for Jekyll)
- Bundler (for Ruby gems)

## Setup Steps

1. **Install Node.js dependencies**

   ```bash
   npm install --no-optional
   ```

   This will install all the updated JavaScript dependencies defined in the package.json file.

   > **Note:** If you see warnings about fsevents, these can be safely ignored. fsevents is an optional dependency that is only used on macOS.

2. **Install Ruby dependencies**

   ```bash
   bundle install
   ```

   This will install all the Ruby gems defined in the Gemfile.

3. **Build the site**

   ```bash
   npm run build
   ```

   This will compile the Sass files and build the Jekyll site.

4. **Start the development server**

   ```bash
   npm start
   ```

   This will start a development server with live reloading at http://localhost:4000.

## Deploying to GitHub Pages

1. **Prepare your repository**

   Make sure your repository is set up for GitHub Pages. If you're creating a new repository:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

2. **Configure GitHub Pages in your repository settings**

   - Go to your GitHub repository
   - Navigate to Settings > Pages
   - Under "Source", select the branch you want to deploy (usually `main` or `gh-pages`)
   - Select the folder `/_site` if you want to deploy the built site directly
   - Click "Save"

3. **Option 1: Manual deployment**

   Build your site locally and push the changes:

   ```bash
   npm run build
   git add .
   git commit -m "Update site"
   git push
   ```

4. **Option 2: Set up GitHub Actions for automatic deployment**

   Create a file at `.github/workflows/github-pages.yml` with the following content:

   ```yaml
   name: Build and deploy Jekyll site to GitHub Pages

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     github-pages:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2

         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: "16"

         - name: Install Node.js dependencies
           run: npm install --no-optional

         - name: Setup Ruby
           uses: ruby/setup-ruby@v1
           with:
             ruby-version: "3.0"
             bundler-cache: true

         - name: Install Ruby dependencies
           run: bundle install

         - name: Build site
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./_site
             publish_branch: gh-pages
   ```

5. **Update baseurl for GitHub Pages**

   If you're deploying to a project page (not a user or organization page), you'll need to update the `baseurl` in `_config.yml` to match your repository name:

   ```yaml
   # For a project page: https://username.github.io/repository-name/
   baseurl: "/repository-name"

   # For a user or organization page: https://username.github.io/
   baseurl: ""
   ```

   > **Note:** Make sure to replace `repository-name` with your actual repository name.

6. **Custom domain (optional)**

   If you want to use a custom domain:

   - Add your domain to the CNAME file in the root of your repository
   - Update your DNS settings to point to GitHub Pages
   - In your repository settings, add your custom domain under the GitHub Pages section

## What's Been Updated

- Updated all Node.js dependencies to their latest compatible versions
- Updated the Node.js engine requirement to version 16 or higher
- Updated the gulpfile.js to be compatible with the latest versions of the dependencies
- Specifically updated:
  - gulp-sass to v5.1.0 (which requires a different setup with the sass compiler)
  - Replaced del with rimraf for CommonJS compatibility
  - bourbon and bourbon-neat to their latest versions
- Moved fsevents to optionalDependencies to prevent installation failures
- Removed jekyll-last-modified-at plugin due to compatibility issues with posix-spawn
- Fixed asset path issues by updating the baseurl configuration in \_config.yml

## Troubleshooting

If you encounter any issues:

1. **Sass compilation errors**

   - Check that the Sass files are compatible with the latest version of Sass
   - Look for deprecated Sass features that might need updating

2. **Jekyll build errors**

   - Make sure you have the correct version of Jekyll installed
   - Check for any deprecated Jekyll features or plugins

3. **Node.js errors**

   - Make sure you're using Node.js version 16 or higher
   - Try deleting the node_modules directory and running npm install again

4. **fsevents errors**

   - If you see errors related to fsevents during npm install, these can be safely ignored
   - fsevents is now marked as an optional dependency and is only used on macOS
   - You can try installing with the --no-optional flag: `npm install --no-optional`

5. **node-gyp errors**

   - If you encounter node-gyp errors, you may need to install build tools
   - On macOS: `xcode-select --install`
   - On Windows: `npm install --global --production windows-build-tools`
   - On Linux: `sudo apt-get install build-essential`

6. **Asset path issues**

   - If images or CSS files aren't loading, check the baseurl configuration in \_config.yml
   - For development, the baseurl should be set to an empty string: `baseurl: ""`
   - For GitHub Pages project sites, it should be set to your repository name: `baseurl: "/repository-name"`
