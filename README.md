# VicBlog Gatsby

[![Build Status](https://travis-ci.org/viccrubs/VicBlog-Gatsby.svg?branch=master)](https://travis-ci.org/viccrubs/VicBlog-Gatsby)

VicBlog is now a static website!

[Check it now!](https://viccrubs.tk)

## Features

- Fully static website with modern web technologies
- Support for Progressive Web Application
- Seperated source code and contents
- Comment system via [Gitment](https://imsun.net/posts/gitment-introduction/)
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

# **After build**, serve the production build
yarn run serveProd
```

Notice that a dependency **sharp** needs to pull [prebuilt binaries from GitHub releases](https://github.com/lovell/sharp-libvips/releases) during installation. However, GitHub hosts release files on AWS, which is blocked in China. Failure to download these files will cause failure in installation and following steps.

To successfully download these files, follow these steps:
1. Download the file yourself
2. Upload the file into a cloud service (I use qiniu storage) and get the URL, which needs to be accessible from Internet
3. Set the environment variable `SHARP_DIST_BASE_URL` to the URL without the filename itself
4. Disable your proxy! (**important** if you are using shadowsocks)
5. `yarn install` and you are ready to go!

You may use `http://olaviw8n8.bkt.clouddn.com/` as the BASE_URL to test but be sure to change it as long as you upload it yourself.
See [the official docs](http://sharp.pixelplumbing.com/en/stable/install/#pre-compiled-libvips-binaries) about changing the base url for the binary.

## Continuous Integration and Delivery

[Travis-CI](https://travis-ci.org) builds and publishes directly into viccrubs.github.io for every commit.

## Credits

Built with [Gatsby](https://www.gatsbyjs.org/) - the blazing-fast static site generator for [React](https://facebook.github.io/react/).
