import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";
import { contentPaths, readContentFile } from "src/data/contentFiles";

export interface Spark {
  id: string;
  time: string; // ISO string
  content: string;
}

const sparkFiles = contentPaths.filter((path) => /^contents\/sparks\/[^/]+\.md$/.test(path));

// Spark ids are fixed once the site is built. Compute the set at module load
// so the views API can validate ids without re-reading content per request.
export const sparkIds: ReadonlySet<string> = new Set(
  sparkFiles
    .map((file) => matter(readContentFile(file)).data.id)
    .filter((id): id is string => typeof id === "string"),
);

export async function loadSparks(): Promise<Spark[]> {
  "use cache";
  cacheLife("articles");
  cacheTag("sparks");
  const sparks: Spark[] = [];
  for (const file of sparkFiles) {
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
