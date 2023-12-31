# <img src="assets/logo.svg" height="36"/> ddadaal.me

[![GitHub Actions](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fddadaal%2Fddadaal.me%2Fbadge&style=flat-square)](https://actions-badge.atrox.dev/ddadaal/ddadaal.me/goto)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m784338835-04a1fd43c45b34e89ae1b336?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![RSS Subscribes](https://img.shields.io/badge/dynamic/json?color=ffa500&label=RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%257Cinoreader%26queryKey%3Dhttps%3A%2F%2Fddadaal.me%2Frss.xml&logo=rss&style=flat-square)](https://ddadaal.me/rss.xml)

ddadaal.me (previously VicBlog) is the personal website of [ddadaal](https://ddadaal.me).

Currently it is built with [Next.js](https://nextjs.org/) and statically exported.

[Check it out now!](https://ddadaal.me)

## Features

- Static website with modern web technologies
- Styled using plain HTML and CSS to style with **12** themes to choose
- Layout and data logic built from scratch
- Synchronous & Native **Search** using [minisearch](https://lucaong.github.io/minisearch/)
- Custom and fully-controlled markdown to HTML processing using [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype)
- Code Syntax Highlight using [rehype-pretty-code](https://rehype-pretty-code.netlify.app/)
- Auto generated RSS Feed at [/rss.xml](https://ddadaal.me/rss.xml)
- Support multiple languages (Chinese & English) and dynamically changing languages
- Articles written on markdown; Source code and contents separated
- Auto generated [slide directory](https://ddadaal.me/slides) using GitHub API on every build
- AI Features
  - Article Summary Powered by [Azure AI Language Service](https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization)

## Tools and Frameworks Used

- [Next.js](https://nextjs.org/): The React framework
- [TypeScript](https://www.typescriptlang.org/): the new go-to for any JavaScript projects
- [Tailwind](https://tailwindcss.com/): Build beautiful website using just HTML
- [daisyui](https://daisyui.com/): Simple Tailwind based UI component library without any JS
- [react-typed-i18n](https://github.com/ddadaal/react-typed-i18n): a self-made dynamic and strongly-typed i18n library utilizing TypeScript's [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [gitalk](https://github.com/gitalk/gitalk): a comment system that works out of box
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icon library for React
- [ESLint](https://eslint.org/): Linter
- [editorconfig](https://editorconfig.org/): unify code editor preferences
- [GitHub Pages](https://pages.github.com): free and popular static website host
- [GitHub Actions](https://github.com/features/actions): CI/CD built directly into the repo!

## Development

We are using [pnpm](https://pnpm.io) for package management.

Notice: If an environment variable is named `GITHUB_TOKEN`, it will be used to authenticate GitHub requests to fetch slides (to get higher rate limit for CI). If it does not exist, an anonymous request is used, which is adequate for local development.

``` bash
# install dependencies
pnpm install

# serve with hot reload at localhost:8000
pnpm dev

# run production build
pnpm build

# **After build**, serve the production build locally
pnpm serve
```

## License

MIT
