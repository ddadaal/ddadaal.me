import { NextRequest, NextResponse } from "next/server";
import { readAllArticlesCached } from "src/data/articles";
import { getArticleViews, recordArticleView } from "src/server/articleViews";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ id: string }>;
}

const headers = { "Cache-Control": "no-store" };

async function handleViews(context: Context, record: boolean) {
  const { id } = await context.params;
  const articles = await readAllArticlesCached();
  if (id.length > 256 || !articles.some((article) => article.id === id)) {
    return NextResponse.json({ error: "Article not found" }, { status: 404, headers });
  }

  try {
    const views = await (record ? recordArticleView(id) : getArticleViews(id));
    return NextResponse.json({ articleId: id, views }, { headers });
  }
  catch (error: unknown) {
    // Keep details out of the response, but include the driver message in
    // server logs so a missing migration, bad host, or firewall rule can be
    // diagnosed without ever logging the SQL password.
    const message = error instanceof Error ? error.message : String(error);
    console.error("Article view storage unavailable:", message);
    return NextResponse.json({ error: "View count unavailable" }, { status: 503, headers });
  }
}

export async function GET(_request: NextRequest, context: Context) {
  return handleViews(context, false);
}

export async function POST(request: NextRequest, context: Context) {
  // Require JSON to reject cross-origin form submissions. Cross-origin fetches
  // need a CORS preflight, and this endpoint does not grant CORS access.
  if (request.headers.get("sec-fetch-site") === "cross-site"
    || request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "JSON requests from this site are required" }, { status: 403, headers });
  }
  return handleViews(context, true);
}
