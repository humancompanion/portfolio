source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
# gem "jekyll", "~> 3.7.3"

gem "rubyzip", "~> 1.3.0"

gem "html-proofer"

# webrick was removed from Ruby's default gems in 3.0; Jekyll 3.9's local
# `serve` still needs it. Local-dev only — GitHub Pages builds without it.
gem "webrick", "~> 1.8"

# Ruby 3.4 removed these from the default gems; Jekyll 3.9 / github-pages don't
# declare them, so they must be listed explicitly or `require` fails.
gem "csv"
gem "base64"
gem "bigdecimal"
gem "logger"

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
gem "github-pages", "~> 228", group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-seo-tag'
  gem 'jekyll-sitemap'
  # Removed jekyll-last-modified-at due to compatibility issues with posix-spawn
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
