# <img src="assets/logo.svg" height="36"/> ddadaal.me

[![GitHub Actions](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fddadaal%2Fddadaal.me%2Fbadge&style=flat-square)](https://actions-badge.atrox.dev/ddadaal/ddadaal.me/goto)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m784338835-04a1fd43c45b34e89ae1b336?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![RSS Subscribes](https://img.shields.io/badge/dynamic/json?color=ffa500&label=RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%257Cinoreader%26queryKey%3Dhttps%3A%2F%2Fddadaal.me%2Frss.xml&logo=rss&style=flat-square)](https://ddadaal.me/rss.xml)

ddadaal.me (previously VicBlog) is the personal website of [ddadaal](https://ddadaal.me).

Currently it is built with [Gatsby](https://gatsbyjs.com).

[Check it out now!](https://ddadaal.me)

## Features

- Static website with modern web technologies
- Built without templates
- Auto-generated RSS Feed at [/rss.xml](https://ddadaal.me/rss.xml)
- Synchronous & Native **Search**
    - Native support for searching articles without any third-party services
- Support multiple languages (Chinese & English) and dynamically changing languages
- Articles written on markdown; Source code and contents separated
    - Supports inline react components
- Auto generated [slide directory](https://ddadaal.me/slides) using GitHub API v3 on every build

## Tools and Frameworks Used

- [Gatsby](https://www.gatsbyjs.org/): the blazing-fast and flexible static site generator with a big community for [React](https://facebook.github.io/react/)
- [TypeScript](https://www.typescriptlang.org/): the new go-to for any JavaScript projects
- [simstate](https://github.com/ddadaal/simstate): a self-made simple but enough strongly-typed hooks-based state management
- [react-typed-i18n](https://github.com/ddadaal/react-typed-i18n): a self-made dynamic and strongly-typed i18n library utilizing TypeScript's [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [styled-components](https://github.com/styled-components/styled-components): component-ize your styles as well
- [SCSS](https://sass-lang.com/): bootstrap used SCSS so...trying to get rid of it in the future
- [gitalk](https://github.com/gitalk/gitalk): a comment system that works out of box
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icon library for React
- [ESLint](https://eslint.org/): Linter
- [editorconfig](https://editorconfig.org/): unify code editor preferences
- [Baidu Analytics](https://tongji.baidu.com): Baidu Analytics
- [CNZZ](https://www.umeng.com/web): CNZZ Analytics
- [GitHub Pages](https://pages.github.com): free and popular static website host
- [GitHub Actions](https://github.com/features/actions): CI/CD built directly into the repo!

## Development

npm instead of yarn is preferred, because integrity check in yarn sometimes needs more information than provided by taobao npm mirror.

Notice: If an environment variable is named `ACTIONS_TOKEN`, it will be used to authenticate GitHub requests to fetch slides (to get higher rate limit for CI). If it does not exist, an anonymous request is used, which is adequate for local development.

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

## Network Issues

### sharp binaries

A dependency **sharp** needs to pull [prebuilt binaries from GitHub releases](https://github.com/lovell/sharp-libvips/releases) during installation. GitHub hosts release files on AWS, which is sometimes blocked in China. Failure to download these files will cause failure in installation and following steps.

Thankfully, according to [the official docs](http://sharp.pixelplumbing.com/en/stable/install/#pre-compiled-libvips-binaries), we can change the base url for this file. With the help of python 3's `http.server` module, we can start a local http server and serve the file from local.

If you encountered download error mentioned above, follow the following steps to complete installation:

1. Download the file yourself and place the file into a directory
2. Run `python -m http.server {port} --bind {url}` and keep it running until the installation completes.
3. Set the environment variable `SHARP_DIST_BASE_URL` to `http://{url}:{port}`
4. `npm install` and you are ready to go!

### handling network errors when making request to GitHub API

A network request to GitHub will be started when running the application to retrieve my slides information from my repo, but such network might fail.

Error handling for such errors has been added, so that when the request to GitHub API fails, a warning is printed on the console, and a dummy Slide node is created, so that the whole application can still run.

## License

MIT
