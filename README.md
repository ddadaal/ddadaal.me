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
- [daisyui](https://daisyui.com/): Simple Tailwind based UI component library without any JS
- [react-typed-i18n](https://github.com/ddadaal/react-typed-i18n): a self-made dynamic and strongly-typed i18n library utilizing TypeScript's [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [gitalk](https://github.com/gitalk/gitalk): a comment system that works out of box
- [react-icons](https://github.com/react-icons/react-icons): extremely abundant but easy-to-use icon library for React
- [ESLint](https://eslint.org/): Linter
- [editorconfig](https://editorconfig.org/): unify code editor preferences
- [Docker](https://www.docker.com/): standalone server deployment
- [GitHub Actions](https://github.com/features/actions): CI/CD built directly into the repo!

## Development

We are using [pnpm](https://pnpm.io) for package management.

``` bash
# install dependencies
pnpm install

# serve with hot reload at localhost:3000
pnpm dev

# run production build
pnpm build

# **After build**, serve the production build locally
pnpm start
```

## Article view counts and Azure SQL

The database layer uses Drizzle ORM's native `node-mssql` adapter. SQL Server support currently requires the release candidate, so `drizzle-orm` and `drizzle-kit` are pinned to `1.0.0-rc.4`. The table is defined in [src/db/schema.ts](src/db/schema.ts), and versioned SQL migrations are committed in `drizzle/`.

Create an Azure SQL database. The application uses `dbo.ArticleViews`, keyed by the Markdown frontmatter `id`, with a `bigint` count and UTC last visit time. An article with no stored row has zero views; its first visit creates the row atomically. Increments use a Drizzle transaction with SQL Server's serializable isolation to protect concurrent first visits and updates.

Copy `.env.example` to `.env.local` for local development and fill in `AZURE_SQL_SERVER`, `AZURE_SQL_DATABASE`, `AZURE_SQL_USER`, and `AZURE_SQL_PASSWORD`. Use the server hostname (for example, `example.database.windows.net`), without a URL scheme. Connections use TLS with certificate verification. Keep `AZURE_SQL_TRUST_SERVER_CERTIFICATE=false` for Azure SQL. Allow the deployment server's outbound IP in the Azure SQL firewall and ensure it can reach the database port (normally TCP 1433).

The server automatically creates the configured database if it does not exist and runs pending Drizzle migrations before accepting requests. This initialization runs through Next.js `instrumentation` once per server process. It is skipped during `next build` and when no `AZURE_SQL_*` variables are configured. If the database is unavailable or startup credentials lack permission, startup fails with the driver error instead of serving a partially initialized application.

You can also apply the committed migrations manually, using credentials with permission to create tables and the `drizzle` migration schema:

```bash
pnpm install --frozen-lockfile
# Reads .env.local, then .env; existing process environment takes precedence.
pnpm db:migrate

# After editing src/db/schema.ts, generate and review the next migration:
pnpm db:generate
```

Drizzle tracks applied migrations, so running `pnpm db:migrate` again preserves existing counts. Migrations never run during image build or a visitor request. The runtime database user needs `SELECT`, `INSERT`, and `UPDATE` on `dbo.ArticleViews`; it does not need schema creation permissions after the initial automatic setup. For an existing database user named `blog_app`, an administrator can grant these with:

```sql
GRANT SELECT, INSERT, UPDATE ON OBJECT::dbo.ArticleViews TO [blog_app];
```

For integration tests, point the `AZURE_SQL_*` environment variables at a dedicated SQL Server database whose name ends in `_test`, then run `pnpm test:db`. These tests apply migrations and verify concurrent increments, large counts, read-only queries, request validation, and attachment access boundaries. They remove only the randomly generated article counters they create. For a local SQL Server with a self-signed certificate, set `AZURE_SQL_TRUST_SERVER_CERTIFICATE=true`.

Each article page opening (including refreshes and client navigation) records a page view after the browser mounts the page. Translations and the default URL share the same article ID and total. About pages are also counted. Lists, search, prerendering, link prefetches, and requests without browser JavaScript do not increment counts. This measures page views, not unique visitors, and stores no visitor identifiers. A public counter is not intended as fraud-resistant analytics.

View counts appear alongside the date and reading time in article list items, search results, and article headers. Lists and search results fetch totals with GET; only opening an article records a view.

`POST /api/articles/:id/views` with `Content-Type: application/json` increments and returns `{ "articleId": "…", "views": "1" }`; `GET` reads the total without incrementing it. Counts are decimal strings to preserve SQL `bigint` precision. Unknown IDs return 404. Responses are never cached. If SQL is unconfigured or unavailable, these endpoints return 503 and the article remains readable with its counter hidden. Build and server startup do not require a database connection.

If the server logs `Article view storage unavailable`, check the following in order:

```bash
# Verify the variables are present (do not print the password).
env | grep '^AZURE_SQL_' | sed 's/AZURE_SQL_PASSWORD=.*/AZURE_SQL_PASSWORD=<redacted>/'

# Apply the table migration using the same environment as the running app.
pnpm db:migrate

# Confirm the database is reachable from the app host.
pnpm test:db
```

When the blog runs directly on the host and SQL Server runs in `docker-compose.yaml`, use `AZURE_SQL_SERVER=localhost`. When both the blog and SQL Server run in Docker Compose, use `AZURE_SQL_SERVER=sqlserver` and do not use `localhost`; inside a container, `localhost` means that container itself. For Azure SQL, use the server hostname such as `example.database.windows.net`, keep encryption enabled, and allow the deployment server's outbound IP in the Azure SQL firewall. The server log now includes the driver error message (without the configured password); the HTTP response intentionally remains a generic 503.

## Local SQL Server for development and tests

[docker-compose.yaml](docker-compose.yaml) runs SQL Server 2022 Developer on `localhost:1433`, with a health check and a named volume for its data. The `sqlserver-init` service creates `blog_views_test` if it does not already exist. Its name is compatible with the database integration tests.

```bash
cp .env.test.example .env.local
docker compose --env-file .env.local up -d --wait sqlserver
docker compose --env-file .env.local run --rm sqlserver-init

# Apply Drizzle migrations to the local test database.
pnpm db:migrate

# Generate content metadata, then run the database integration tests.
pnpm build:data
pnpm test:db

# Run the blog locally with the same database.
pnpm dev
```

If you already have a `.env.local`, merge the values from `.env.test.example` into it. Next.js, Drizzle Kit, and the database tests all read `.env.local`; existing process environment variables take precedence. You can change `AZURE_SQL_PORT` in this file if port 1433 is occupied. The example password is only for local testing; changing it after the data volume has been initialized also requires changing the existing SQL Server login password.

```bash
# Stop the database and keep its data.
docker compose --env-file .env.local down

# Reset the local database by removing its data volume.
docker compose --env-file .env.local down -v
```

## Docker deployment

```bash
docker build -t ddadaal-me .
cp .env.example .env.production.local
# Fill in the Azure SQL credentials in .env.production.local, then:
docker run -d --name ddadaal-me --restart unless-stopped \
  --env-file .env.production.local -p 3000:3000 ddadaal-me
```

The container runs as a non-root user and listens on `0.0.0.0:3000`. Put your HTTPS reverse proxy in front of this port. SQL credentials are supplied only at runtime; environment files are excluded from the Docker build context. Counts persist in Azure SQL across image rebuilds and container replacements. The image includes the article files, attachments, Next.js static assets, RSS, sitemap, and robots.txt; rebuild it when publishing content. Only the blog container is needed on the deployment server.

GitHub Actions validates the Docker build instead of deploying the static `out` directory to GitHub Pages. Publishing the image to a registry and restarting your deployment can be configured for your chosen server later.

## License

MIT
