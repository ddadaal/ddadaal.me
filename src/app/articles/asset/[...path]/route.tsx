import { createReadStream } from "fs";
import { realpath, stat } from "fs/promises";
import { lookup } from "mime-types";
import { NextRequest, NextResponse } from "next/server";
import { extname, relative, resolve, sep } from "path";
import { Readable } from "stream";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  const notFound = () => new NextResponse(null, { status: 404 });

  if (path[0] !== "contents") {
    return notFound();
  }

  try {
    // Resolve symlinks as well as .. segments before checking the boundary.
    // Next.js already decodes route parameters; decoding again is unsafe.
    const root = await realpath(resolve("contents"));
    const fullPath = await realpath(resolve(...path));
    const relativePath = relative(root, fullPath);
    if (
      !relativePath ||
      relativePath === ".." ||
      relativePath.startsWith(`..${sep}`) ||
      [".md", ".mdx"].includes(extname(fullPath).toLowerCase()) ||
      fullPath.endsWith(".summary.json")
    ) {
      return notFound();
    }

    const fileStat = await stat(fullPath);
    if (!fileStat.isFile()) {
      return notFound();
    }

    return new NextResponse(
      Readable.toWeb(createReadStream(fullPath)) as ReadableStream<Uint8Array>,
      {
        headers: {
          "Content-Type": lookup(fullPath) || "application/octet-stream",
          "Content-Length": String(fileStat.size),
          "Cache-Control": "public, max-age=3600",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EACCES"].includes((error as NodeJS.ErrnoException).code ?? "")) {
      return notFound();
    }
    throw error;
  }
}
