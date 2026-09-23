import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";
import { contentPaths, readContentFile } from "src/data/contentFiles";

export interface Spark {
  id: string;
  time: string; // ISO string
  content: string;
}

export async function loadSparks(): Promise<Spark[]> {
  "use cache";
  cacheLife("articles");
  cacheTag("sparks");
  const files = contentPaths.filter((path) => /^contents\/sparks\/[^/]+\.md$/.test(path));
  const sparks: Spark[] = [];
  for (const file of files) {
    const raw = readContentFile(file);
    const { data, content } = matter(raw);
    if (typeof data.id === "string" && typeof data.time === "string") {
      sparks.push({ id: data.id, time: data.time, content });
    }
  }
  // sort by time desc
  sparks.sort((a, b) => b.time.localeCompare(a.time));
  return sparks;
}
