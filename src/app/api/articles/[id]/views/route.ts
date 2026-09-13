import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { readAllArticlesCached } from "src/data/articles";
import { getArticleViews, recordVisitEvent, VisitEventInput } from "src/server/articleViews";

interface Context {
  params: Promise<{ id: string }>;
}

const noStoreHeaders = { "Cache-Control": "no-store" };
const readHeaders = {
  // View totals are eventually consistent by design. This lets a browser or
  // an ingress cache reuse the same snapshot without querying SQL repeatedly.
  "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
};

function parseUserAgent(userAgent: string | null) {
  const value = userAgent ?? "";
  const isBot = /bot|crawler|spider|slurp|headless|monitor|curl|wget/i.test(value);
  const browser = value.includes("Edg/")
    ? "Edge"
    : value.includes("Chrome/")
      ? "Chrome"
      : value.includes("Firefox/")
        ? "Firefox"
        : value.includes("Safari/")
          ? "Safari"
          : /\b(?:bot|crawler)\b/i.test(value)
            ? "Bot"
            : "Other";
  const operatingSystem = value.includes("Windows")
    ? "Windows"
    : value.includes("Android")
      ? "Android"
      : /iPhone|iPad|iPod/.test(value)
        ? "iOS"
        : value.includes("Mac OS X")
          ? "macOS"
          : value.includes("Linux")
            ? "Linux"
            : "Other";
  const deviceType = /iPad|Android|Mobile|iPhone|iPod/.test(value)
    ? value.includes("iPad")
      ? "tablet"
      : "mobile"
    : "desktop";
  return { browser, operatingSystem, deviceType, isBot };
}

function hashIp(request: NextRequest) {
  const salt = process.env.ANALYTICS_IP_HASH_SALT;
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip");
  if (!salt || !address) return undefined;
  return createHash("sha256").update(`${salt}:${address}`).digest("hex");
}

async function handleViews(request: NextRequest, context: Context, record: boolean) {
  const { id } = await context.params;
  const articles = await readAllArticlesCached();
  if (id.length > 256 || !articles.some((article) => article.id === id)) {
    return NextResponse.json(
      { error: "Article not found" },
      { status: 404, headers: noStoreHeaders },
    );
  }

  try {
    if (!record) {
      const views = await getArticleViews(id);
      return NextResponse.json({ articleId: id, views }, { headers: readHeaders });
    }

    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      // An empty body is accepted for older clients; request metadata remains useful.
    }
    const stringField = (name: string, max: number) =>
      typeof body[name] === "string" ? body[name].slice(0, max) : undefined;
    const sessionId = request.cookies.get("visit_session")?.value ?? randomUUID();
    const userAgent = parseUserAgent(request.headers.get("user-agent"));
    const started = Date.now();
    const event: VisitEventInput = {
      sessionId,
      path: stringField("path", 2048) ?? `/articles/${id}`,
      referrer: stringField("referrer", 2048),
      utmSource: stringField("utmSource", 256),
      utmMedium: stringField("utmMedium", 256),
      utmCampaign: stringField("utmCampaign", 256),
      ipHash: hashIp(request),
      ...userAgent,
      statusCode: 200,
      responseMs: Date.now() - started,
    };
    const views = await recordVisitEvent(id, event);
    const response = NextResponse.json({ articleId: id, views }, { headers: noStoreHeaders });
    response.cookies.set("visit_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    // Keep details out of the response, but include the driver message in
    // server logs so a missing migration, bad host, or firewall rule can be
    // diagnosed without ever logging the SQL password.
    const message = error instanceof Error ? error.message : String(error);
    console.error("Article view storage unavailable:", message);
    return NextResponse.json(
      { error: "View count unavailable" },
      { status: 503, headers: noStoreHeaders },
    );
  }
}

export async function GET(request: NextRequest, context: Context) {
  return handleViews(request, context, false);
}

export async function POST(request: NextRequest, context: Context) {
  // Require JSON to reject cross-origin form submissions. Cross-origin fetches
  // need a CORS preflight, and this endpoint does not grant CORS access.
  if (
    request.headers.get("sec-fetch-site") === "cross-site" ||
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json"
  ) {
    return NextResponse.json(
      { error: "JSON requests from this site are required" },
      { status: 403, headers: noStoreHeaders },
    );
  }
  return handleViews(request, context, true);
}
