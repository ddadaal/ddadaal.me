# <img src="./assets/logo.svg" height="36"/> VicBlog Gatsby

![Travis (.org)](https://img.shields.io/travis/vicblog/VicBlog-Gatsby?style=flat-square)
![Uptime Robot ratio (7 days)](https://img.shields.io/uptimerobot/ratio/7/m783121264-44b0baa03c3161906ebe4cea.svg?style=flat-square)
![Codacy grade](https://img.shields.io/codacy/grade/72cd7c1496d643b98404521f33b5a7ff.svg?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)

VicBlog is a static personal blog built with Gatsby.

[Check it out now!](https://daacheen.me)

## Features

- Static website with modern web technologies
- Auto-generated RSS Feed at [/rss.xml](https://daacheen.me/rss.xml)
- Synchronous & Native **Search**
    - Native support for searching articles without any third-party services
- Progressive Web Application
- Support multiple languages (Chinese & English)
- Articles written on markdown; Source code and contents separated
    - Supports inline react components
- Auto generated [slide directory](https://daacheen.me/slides) using GitHub API v3 on every build
- Analytics via [CNZZ](https://www.cnzz.com)

## Tools and Frameworks Used

- [Gatsby](https://www.gatsbyjs.org/): the blazing-fast and flexible static site generator with a big community for [React](https://facebook.github.io/react/)
- [TypeScript](https://www.typescriptlang.org/): the new go-to for any JavaScript projects
- [simstate](https://github.com/daacheen/simstate): a self-made simple but enough strongly-typed hooks-based state management
- [styled-components](https://github.com/styled-components/styled-components): component-ize your styles as well
- [SCSS](https://sass-lang.com/): bootstrap used SCSS so...trying to get rid of it in the future
- [gitalk](https://github.com/gitalk/gitalk): a comment system that works out of box
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icon library for React
- [ESLint](https://eslint.org/): [tslint is being deprecated](https://medium.com/palantir/tslint-in-2019-1a144c2317a9)! This project is a pioneer in fully leveraging ESLint in a React+TypeScript project!
- [editorconfig](https://editorconfig.org/): unify code editor preferences
- [CNZZ](https://www.cnzz.com): simple and free website analysis for mainland China
- [GitHub Pages](https://pages.github.com): free and popular static website host

## Development

[Yarn](https://yarnpkg.com/) is required.

Notice: If an environment variable is named `GITHUB_TOKEN`, it will be used to authenticate GitHub requests to fetch slides (to get higher rate limit for CI). If it does not exist, an anonymous request is used, which is adequate for local development. Remove the environment variable `GITHUB_TOKEN` before getting started.

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

At every commit to master branch, [Travis-CI](https://travis-ci.org) builds and publishes directly into coding.net and GitHub Pages.

## License

MIT
