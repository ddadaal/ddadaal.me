function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

// Shared by the application and Drizzle Kit. Read only when connecting, so
// generating migrations and building the Docker image need no SQL credentials.
export function sqlConfig() {
  const port = Number(process.env.AZURE_SQL_PORT ?? "1433");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("AZURE_SQL_PORT must be a valid TCP port");
  }

  return {
    server: requiredEnv("AZURE_SQL_SERVER"),
    database: requiredEnv("AZURE_SQL_DATABASE"),
    user: requiredEnv("AZURE_SQL_USER"),
    password: requiredEnv("AZURE_SQL_PASSWORD"),
    port,
    options: {
      encrypt: true,
      // Only enable this for a local SQL Server with a self-signed certificate.
      trustServerCertificate: process.env.AZURE_SQL_TRUST_SERVER_CERTIFICATE === "true",
    },
    pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
    connectionTimeout: 10000,
    requestTimeout: 10000,
  };
}
