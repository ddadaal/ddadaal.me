// Shared by the application and Drizzle Kit. Read only when connecting, so
// generating migrations and building the Docker image touch no database file.
export function sqliteDbPath() {
  return process.env.SQLITE_DB_PATH ?? "data/views.db";
}
