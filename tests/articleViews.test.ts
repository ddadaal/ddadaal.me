import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { eq, inArray } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-mssql/migrator";
import { NextRequest } from "next/server.js";

import { GET, POST } from "../src/app/api/articles/[id]/views/route.js";
import { GET as getAsset } from "../src/app/articles/asset/[...path]/route.js";
import { getDb, getSqlPool } from "../src/db/client.js";
import { sqlConfig } from "../src/db/config.js";
import { articleViews, visitEvents } from "../src/db/schema.js";
import { getArticleViews, recordArticleView } from "../src/server/articleViews.js";

const testIds = [randomUUID(), randomUUID(), randomUUID()];
let connected = false;

before(async () => {
  assert.match(
    sqlConfig().database,
    /_test$/,
    "Use a dedicated SQL Server database ending in _test",
  );
  const db = await getDb();
  connected = true;
  await migrate(db, { migrationsFolder: "./drizzle" });
  await migrate(db, { migrationsFolder: "./drizzle" });
});

after(async () => {
  if (!connected) {
    return;
  }
  const db = await getDb();
  await db.delete(articleViews).where(inArray(articleViews.articleId, testIds));
  await db.delete(visitEvents).where(inArray(visitEvents.articleId, testIds));
  await (await getSqlPool()).close();
});

void test("concurrent first visits and subsequent visits retain every increment", async () => {
  const ids = testIds.slice(0, 2);
  for (const id of ids) {
    assert.equal(await getArticleViews(id), "0");
  }

  const visits = 40;
  const results = await Promise.all(
    Array.from({ length: visits * ids.length }, async (_, index) => {
      const id = ids[index % ids.length];
      return { id, views: await recordArticleView(id) };
    }),
  );

  for (const id of ids) {
    assert.deepEqual(
      results
        .filter((result) => result.id === id)
        .map((result) => Number(result.views))
        .sort((a, b) => a - b),
      Array.from({ length: visits }, (_, index) => index + 1),
    );
    assert.equal(await getArticleViews(id), String(visits));
    assert.equal(await recordArticleView(id), String(visits + 1));
    assert.equal(await getArticleViews(id), String(visits + 1));
  }
});

void test("BIGINT values above JavaScript's safe integer limit remain exact", async () => {
  const db = await getDb();
  const id = testIds[2];
  await db.insert(articleViews).values({ articleId: id, viewCount: "9007199254740992" });
  assert.equal(await recordArticleView(id), "9007199254740993");
  assert.equal(await getArticleViews(id), "9007199254740993");

  const [row] = await db.select().from(articleViews).where(eq(articleViews.articleId, id));
  assert.ok(Math.abs(Date.now() - row.lastViewedAt.getTime()) < 60000);
});

void test("GET is read-only and unknown article IDs cannot be counted", async () => {
  const id = "about-project";
  const beforeViews = await getArticleViews(id);
  const response = await GET(new NextRequest(`http://localhost/api/articles/${id}/views`), {
    params: Promise.resolve({ id }),
  });
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=300, stale-while-revalidate=3600",
  );
  assert.deepEqual(await response.json(), { articleId: id, views: beforeViews });
  assert.equal(await getArticleViews(id), beforeViews);

  const unknown = "'; DROP TABLE ArticleViews; --";
  const rejected = await POST(
    new NextRequest("http://localhost/api/articles/unknown/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }),
    { params: Promise.resolve({ id: unknown }) },
  );
  assert.equal(rejected.status, 404);
  assert.equal(await getArticleViews(unknown), "0");
});

void test("cross-site requests and form submissions cannot increment views", async () => {
  const requestHeaders: Record<string, string>[] = [
    { "Content-Type": "text/plain" },
    { "Content-Type": "application/json", "Sec-Fetch-Site": "cross-site" },
  ];
  for (const headers of requestHeaders) {
    const response = await POST(
      new NextRequest("http://localhost/api/articles/about-project/views", {
        method: "POST",
        headers,
      }),
      { params: Promise.resolve({ id: "about-project" }) },
    );
    assert.equal(response.status, 403);
  }
});

void test("the server serves article images but rejects source files and path traversal", async () => {
  const request = new NextRequest("http://localhost/articles/asset/contents/test");
  for (const path of [
    ["package.json"],
    ["contents", "..", "package.json"],
    ["contents", "about-project", "en.md"],
    ["contents", "does-not-exist.png"],
    ["contents", "about-project"],
  ]) {
    const response = await getAsset(request, { params: Promise.resolve({ path }) });
    assert.equal(response.status, 404, path.join("/"));
  }

  const response = await getAsset(request, {
    params: Promise.resolve({ path: ["contents", "20210423-wslg-first-experience", "xclock.png"] }),
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/png");
  assert.ok((await response.arrayBuffer()).byteLength > 0);
});
