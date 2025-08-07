import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { join } from "path";

export interface Spark {
  time: string; // ISO string
  content: string;
}

export async function loadSparks(): Promise<Spark[]> {
  const dir = join(process.cwd(), "contents/sparks");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md"));
  const sparks: Spark[] = [];
  for (const file of files) {
    const raw = await readFile(join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    if (typeof data.time === "string") {
      sparks.push({ time: data.time, content });
    }
  }
  // sort by time desc
  sparks.sort((a, b) => b.time.localeCompare(a.time));
  return sparks;
}
