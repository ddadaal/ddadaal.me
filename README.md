# <img src="assets/logo.svg" height="36"/> ddadaal.me

[![GitHub Actions](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fddadaal%2Fddadaal.me%2Fbadge&style=flat-square)](https://actions-badge.atrox.dev/ddadaal/ddadaal.me/goto)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m784338835-04a1fd43c45b34e89ae1b336?style=flat-square)
![Codacy grade](https://img.shields.io/codacy/grade/72cd7c1496d643b98404521f33b5a7ff.svg?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![RSS Subscribes](https://img.shields.io/badge/dynamic/json?color=ffa500&label=RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%257Cinoreader%26queryKey%3Dhttps%3A%2F%2Fddadaal.me%2Frss.xml&logo=rss&style=flat-square)](https://ddadaal.me/rss.xml)


ddadaal.me (previously VicBlog) is the personal website of [ddadaal](https://ddadaal.me).

Currently it is built with [Gatsby](https://gatsbyjs.com).

[Check it out now!](https://ddadaal.me)

## Features

- Static website with modern web technologies
- Auto-generated RSS Feed at [/rss.xml](https://ddadaal.me/rss.xml)
- Synchronous & Native **Search**
    - Native support for searching articles without any third-party services
- Progressive Web Application
- Support multiple languages (Chinese & English)
- Articles written on markdown; Source code and contents separated
    - Supports inline react components
- Auto generated [slide directory](https://ddadaal.me/slides) using GitHub API v3 on every build

## Tools and Frameworks Used

- [Gatsby](https://www.gatsbyjs.org/): the blazing-fast and flexible static site generator with a big community for [React](https://facebook.github.io/react/)
- [TypeScript](https://www.typescriptlang.org/): the new go-to for any JavaScript projects
- [simstate](https://github.com/ddadaal/simstate): a self-made simple but enough strongly-typed hooks-based state management
- [styled-components](https://github.com/styled-components/styled-components): component-ize your styles as well
- [SCSS](https://sass-lang.com/): bootstrap used SCSS so...trying to get rid of it in the future
- [gitalk](https://github.com/gitalk/gitalk): a comment system that works out of box
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icon library for React
- [ESLint](https://eslint.org/): [tslint is being deprecated](https://medium.com/palantir/tslint-in-2019-1a144c2317a9)! This project is a pioneer in fully leveraging ESLint in a React+TypeScript project!
- [editorconfig](https://editorconfig.org/): unify code editor preferences
- [Google Analytics](https://analytics.google.com/analytics/web/): for web analytics
- [GitHub Pages](https://pages.github.com): free and popular static website host
- [GitHub Actions](https://github.com/features/actions): CI/CD built directly into the repo!

## Development

npm instead of yarn is preferred, because integrity check in yarn usually requires more information than provided by taobao npm mirror.

Notice: If an environment variable is named `ACTION_TOKEN`, it will be used to authenticate GitHub requests to fetch slides (to get higher rate limit for CI). If it does not exist, an anonymous request is used, which is adequate for local development.

``` bash
# For Windows users, install windows-build-tools
npm install --global windows-build-tools --python_mirror=https://npm.taobao.org/mirrors/python/

# install dependencies
npm install

# Install dependencies From TaoBao
npm run iftb

# serve with hot reload at localhost:8000
npm run dev

# run production build
npm run build

# **After build**, serve the production build locally
npm run serve

# Update dependencies with npm-check-updates and update the package.json
npm run upddep
```

## Firewall Notice

A dependency **sharp** needs to pull [prebuilt binaries from GitHub releases](https://github.com/lovell/sharp-libvips/releases) during installation. GitHub hosts release files on AWS, which is sometimes blocked in China. Failure to download these files will cause failure in installation and following steps.

Thankfully, according to [the official docs](http://sharp.pixelplumbing.com/en/stable/install/#pre-compiled-libvips-binaries), we can change the base url for this file. With the help of python 3's `http.server` module, we can start a local http server and serve the file from local.

If you encountered download error mentioned above, follow the following steps to complete installation:

1. Download the file yourself and place the file into a directory
2. Run `python -m http.server {port} --bind {url}` and keep it running until the installation completes.
3. Set the environment variable `SHARP_DIST_BASE_URL` to `http://{url}:{port}`
4. `npm install` and you are ready to go!

### Weird Connection Reset when making request to GitHub API

After using my own implementation to fetch Slides information from GitHub at [commit 0d2c82c](https://github.com/ddadaal/ddadaal.me/commit/0d2c82c3a4e9231a0f2023a6f247b40f028df2f5), I have got `ECONNRESET` when making request to GitHub API during build if no `ACTIONS_TOKEN` env is set. It would only affect the `Slides` page, so it could be ignored if you avoid accessing the `Slides` page.

To fix this, you can set a `ACTIONS_TOKEN` env with a valid GitHub Personally Access Token (no scope needed) to enable the requst to GitHub. Don't worry, it is only used to access the content of [`ddadaal/Slides`](https://github.com/ddadaal/Slides) repository to generate the contents of my Slides pages.

I have no idea why it would happen, because technically GitHub API v3 does allow for anonymous requests, and even though anonymous requests have rate limit, the error when the rate limit is exceeded is **403 Forbidden** rather than a connection request. It is also weird to be able to fix this problem with a simple token. It might just a result of my bad internet connection, and you might not encounter this problem at all, but if you do, try the `ACTIONS_TOKEN` env solution.

Update: Error handling for such error has been added. When the request to GitHub API fails, a warning is printed on the console, and a dummy Slide node is created, so that the whole application can still run.

## License

MIT
