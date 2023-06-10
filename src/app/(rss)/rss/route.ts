import { generateRss } from "src/app/(rss)/rss";

export async function GET() {
  return generateRss();
}
