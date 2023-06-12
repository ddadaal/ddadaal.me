import { NextResponse } from "next/server";

import { generateRss } from "./rss";

export async function GET() {
  const rss = await generateRss();

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });


}
