# <img src="./assets/logo.svg" height="36"/> VicBlog Gatsby

![Travis (.org)](https://img.shields.io/travis/vicblog/VicBlog-Gatsby?style=flat-square)
![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m783121264-44b0baa03c3161906ebe4cea.svg?style=flat-square)
![Codacy grade](https://img.shields.io/codacy/grade/72cd7c1496d643b98404521f33b5a7ff.svg?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

VicBlog is a static personal blog built with Gatsby.

[Check it out now!](https://viccrubs.me)

## Features

- Static website with modern web technologies
- Hook based state management with [simstate](https://github.com/viccrubs/simstate)
- Synchronous & Native **Search**
    - Native support for searching articles without any third-party services
- Progressive Web Application
- Support multiple languages (Chinese & English)
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

# Update dependencies with npm-check-updates and update the package.json
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
