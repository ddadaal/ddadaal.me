import { initializeDatabaseAtStartup } from "src/db/startup";

export async function register() {
  await initializeDatabaseAtStartup();
}
