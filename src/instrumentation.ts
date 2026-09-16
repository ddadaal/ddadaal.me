export async function register() {
  // Instrumentation is analyzed for both Edge and Node runtimes. Keep the
  // Node-only SQL driver and migration dependencies out of the Edge bundle.
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeDatabaseAtStartup } = await import("./db/startup.js");
    await initializeDatabaseAtStartup();
    const { initializeArticleViews } = await import("./server/articleViews.js");
    await initializeArticleViews();
  }
}
