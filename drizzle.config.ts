import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

import { sqliteDbPath } from "./src/db/config";

config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // Generating SQL is an offline operation.
  ...(process.argv.includes("generate") ? {} : { dbCredentials: { url: sqliteDbPath() } }),
});
