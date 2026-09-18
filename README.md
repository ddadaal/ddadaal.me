# <img src="assets/logo.svg" height="36"/> ddadaal.me

[![GitHub Actions](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fddadaal%2Fddadaal.me%2Fbadge&style=flat-square)](https://actions-badge.atrox.dev/ddadaal/ddadaal.me/goto)
![Uptime Robot status](https://img.shields.io/uptimerobot/status/m784338835-04a1fd43c45b34e89ae1b336?style=flat-square)
[![style: styled-components](https://img.shields.io/badge/style-%F0%9F%92%85%20styled--components-orange.svg?colorB=daa357&colorA=db748e)](https://github.com/styled-components/styled-components)
[![RSS Subscribes](https://img.shields.io/badge/dynamic/json?color=ffa500&label=RSS%20Subscribes&query=%24.data.totalSubs&url=https%3A%2F%2Fapi.spencerwoo.com%2Fsubstats%2F%3Fsource%3Dfeedly%257Cinoreader%26queryKey%3Dhttps%3A%2F%2Fddadaal.me%2Frss.xml&logo=rss&style=flat-square)](https://ddadaal.me/rss.xml)

ddadaal.me (previously VicBlog) is the personal website of [ddadaal](https://ddadaal.me).

Currently it is built with [Next.js](https://nextjs.org/) and deployed as a standalone Node.js server in Docker.

[Check it out now!](https://ddadaal.me)

## Features

- Next.js server with prerendered articles and live page view counts stored in Azure SQL
- Styled using plain HTML and CSS to style with **12** themes to choose
- Layout and data logic built from scratch
- Synchronous & Native **Search** using [minisearch](https://lucaong.github.io/minisearch/)
- Custom and fully-controlled markdown to HTML processing using [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype)
- Code Syntax Highlight using [rehype-pretty-code](https://rehype-pretty-code.netlify.app/)
- Auto generated RSS Feed at [/rss.xml](https://ddadaal.me/rss.xml)
- Support multiple languages (Chinese & English) and dynamically changing languages
- Articles written on markdown; Source code and contents separated
- AI Features
  - Article Summary Powered by [Azure AI Language Service](https://learn.microsoft.com/en-us/azure/ai-services/language-service/summarization/overview?tabs=document-summarization)

## Tools and Frameworks Used

- [Next.js](https://nextjs.org/): The React framework
- [TypeScript](https://www.typescriptlang.org/): the new go-to for any JavaScript projects
- [Tailwind](https://tailwindcss.com/): Build beautiful website using just HTML
- [daisyui](https://daisyui.com/): Simple Tailwind based UI to style with **12** themes to choose
- [react-typed-i18n](https://github.com/ddadaal/react-typed-i18n): a self-made dynamic and strongly-typed i18n library utilizing [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- Client-only GitHub Issues comment system, compatible with existing Gitalk issues
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icons
- [Oxlint](https://oxc.rs/docs/guide/usage/linter/) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter/): Linting and formatting
- [editorconfig](https://editorconfig.org/): Editor configuration
- [Docker](https://www.docker.com/): standalone server deployment
- [GitHub Actions](https://github.com/features/actions): CI/CD built directly into the repo!

## Development

We are using [pnpm](https://pnpm.io) for package management.

Development and production builds use Node.js 24.x and pnpm 12.4.1.

```bash
# install dependencies
pnpm install

# serve with hot reload at localhost:3000
pnpm dev

# run production build
pnpm build

# **After build**, serve the production build locally
pnpm start

# check lint rules and formatting
pnpm lint
pnpm format:check

# format supported source files
pnpm format
```

Article Markdown and summary JSON files are server-side modules, discovered by `require.context` in `src/data/contentFiles.ts` and imported as text using `tools/raw-content-loader.cjs`. During `pnpm dev`, Turbopack tracks edits, additions and deletions and refreshes the open page automatically. Article pages, lists, metadata, about pages, sparks and the search index share these dependencies. No generated changemark file or separate watcher process is needed. Content caches use the `articles` profile in `next.config.ts`; short cache lifetimes are not a substitute for Fast Refresh and may require a Suspense boundary with Cache Components. Production content is bundled at build time and updated by building a new image.

Generate article summaries with `pnpm summarize`. See [the summarizer guide](tools/summarize/README.md) for OpenAI-compatible Chat Completions and Responses configuration, other providers, and commands for individual articles.

After editing `src/db/schema.ts`, generate and review the next Drizzle migration:

```bash
pnpm db:generate
```

## Article view counts and SQLite

The database layer uses Drizzle ORM's `node-sqlite` adapter on Node's built-in `node:sqlite` module, so no database server or native driver is required. The tables are defined in [src/db/schema.ts](src/db/schema.ts), and versioned SQL migrations are committed in `drizzle/`.

The database is a single file, `data/views.db` by default; set `SQLITE_DB_PATH` to change it. The file and its parent directory are created automatically, and the application runs pending Drizzle migrations at startup.

```bash
# Reads .env.local, then .env; existing process environment takes precedence.
pnpm db:migrate
```

Drizzle tracks applied migrations, so running `pnpm db:migrate` again preserves existing counts. Migrations never run during image build or a visitor request.

Each article page opening (including refreshes and client navigation) records a page view after the browser mounts the page. Translations and the default URL share the same article ID and total. About pages are also counted. Lists, search, prerendering, link prefetches, and requests without browser JavaScript do not increment counts.

View counts appear alongside the date and reading time in article list items, search results, and article headers. Lists and search results fetch totals with GET; only opening an article records a view.

Comments are rendered by the client-only GitHub Issues integration in `src/components/article/CommentPanel.tsx`. It keeps the legacy Gitalk mapping: the repository is `ddadaal.me.github.io`, and an article uses the `Gitalk` label plus its first 50 ID characters, so existing issues and comments remain visible. GitHub OAuth tokens are stored in the browser's local storage, as in Gitalk. The repository and OAuth settings are defined directly in the component, and the OAuth application callback URL must allow the exact article URL (GitHub returns to the current page).

`POST /api/articles/:id/views` with `Content-Type: application/json` increments and returns `{ "articleId": "…", "views": "1" }`; `GET` reads the total without incrementing it. Counts are decimal strings to preserve precision beyond JavaScript's safe integer limit. Unknown IDs return 404. Next.js Cache Components is enabled for the server. Parsed article content, about pages, sparks, metadata, and the search index use a one-week revalidation window and a one-year expiry, matching the immutable content shipped in each image. Successful POST requests return the exact committed value. If the database file is unwritable or unavailable, these endpoints return 503 and the article remains readable with its counter hidden.

Deployment instructions, including Docker, ACR, GitHub Actions, and AKS, are in [deploy/README.md](deploy/README.md). Mount a volume at `/app/data` in production so the database survives container replacement.

## License

MIT
