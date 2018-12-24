# VicBlog Gatsby

[![Build Status](https://travis-ci.org/viccrubs/VicBlog-Gatsby.svg?branch=master)](https://travis-ci.org/viccrubs/VicBlog-Gatsby)

VicBlog is a static personal blog built with Gatsby.

[Check it now!(https://viccrubs.me)](https://viccrubs.me)

## Features

- Static website with modern web technologies
- Full Support for Progressive Web Application
- Articles written on markdown
- Full i18n
- Source code and contents separated
- Comment system via [gitalk](https://github.com/gitalk/gitalk)
- Icons via [react-icons](https://github.com/react-icons/react-icons)

## Development

**[Yarn](https://yarnpkg.com/zh-Hans/)** instead of NPM is required.

``` bash
# install dependencies
yarn install

# serve with hot reload at localhost:8000
yarn start

# run production build
yarn run build

# **After build**, serve the production build locally
yarn run serve
```

Notice that a dependency **sharp** needs to pull [prebuilt binaries from GitHub releases](https://github.com/lovell/sharp-libvips/releases) during installation. GitHub hosts release files on AWS, which is sometimes blocked in China. Failure to download these files will cause failure in installation and following steps.

Thankfully, according to [the official docs](http://sharp.pixelplumbing.com/en/stable/install/#pre-compiled-libvips-binaries), we can change the base url for this file. With the help of python 3's `http.server` module, we can start a local http server and serve the file from local.

If you encountered download error mentioned above, follow the following steps to complete installation:

1. Download the file yourself and place the file into a directory
2. Run `python -m http.server {port} --bind {url}` and keep it running until the installation completes.
3. Set the environment variable `SHARP_DIST_BASE_URL` to `http://{url}:{port}`
5. `yarn install` and you are ready to go!


## Continuous Integration and Delivery

[Travis-CI](https://travis-ci.org) builds and publishes directly into viccrubs.github.io for every commit.

## Credits

Built with [Gatsby](https://www.gatsbyjs.org/) - the blazing-fast static site generator for [React](https://facebook.github.io/react/).
