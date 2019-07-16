# VicBlog Gatsby

[![Build Status](https://travis-ci.org/vicblog/VicBlog-Gatsby.svg?branch=master)](https://travis-ci.org/vicblog/VicBlog-Gatsby)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

VicBlog is a static personal blog, currently built with Gatsby.

[Check it out now!](https://viccrubs.me)

## Features

- Static website with modern web technologies
- Hook based state management with [simstate](https://github.com/viccrubs/simstate)
- Synchronous & Native **Search**
    - Native support for searching articles without any third-party services
- Progressive Web Application
- Support multi-language (Chinese & English)
- Styling with [styled-components](https://github.com/styled-components/styled-components) and [SCSS](https://sass-lang.com/)
- Articles written on markdown; Source code and contents separated
    - Supports inline react components
- Auto generated [slide directory](https://viccrubs.me/slides) using GitHub API v3 on every build
- Comment system via [gitalk](https://github.com/gitalk/gitalk)
- Icons via [react-icons](https://github.com/react-icons/react-icons)
- Analytics via [CNZZ](https://www.cnzz.com)

## Development

[Yarn](https://yarnpkg.com/) is required.

``` bash
# install dependencies
yarn

# Install dependencies From TaoBao
yarn iftb

# serve with hot reload at localhost:8000
yarn dev

# run production build
yarn build

# **After build**, serve the production build locally
yarn serve

# Update dependencies with npm-check-updates & install dependencies from Taobao
yarn upddep
```

## Firewall Notice

A dependency **sharp** needs to pull [prebuilt binaries from GitHub releases](https://github.com/lovell/sharp-libvips/releases) during installation. GitHub hosts release files on AWS, which is sometimes blocked in China. Failure to download these files will cause failure in installation and following steps.

Thankfully, according to [the official docs](http://sharp.pixelplumbing.com/en/stable/install/#pre-compiled-libvips-binaries), we can change the base url for this file. With the help of python 3's `http.server` module, we can start a local http server and serve the file from local.

If you encountered download error mentioned above, follow the following steps to complete installation:

1. Download the file yourself and place the file into a directory
2. Run `python -m http.server {port} --bind {url}` and keep it running until the installation completes.
3. Set the environment variable `SHARP_DIST_BASE_URL` to `http://{url}:{port}`
4. `npm install` and you are ready to go!


## Continuous Integration and Delivery

[Travis-CI](https://travis-ci.org) builds and publishes directly into viccrubs.github.io for every commit to master.

## Credits

Built with [Gatsby](https://www.gatsbyjs.org/) - the blazing-fast static site generator for [React](https://facebook.github.io/react/).
