import { connection } from "next/server";
import { hasAdminSession, isAdminConfigured } from "src/server/adminAuth";

import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// The single auth gate for reads: the dashboard only renders from the
// authenticated branch, so no analytics query can run for an unauthenticated
// request and there is no separate endpoint to forget to protect.
export async function AdminGate({ searchParams }: Props) {
  // Everything below depends on runtime state (ADMIN_KEY, the session cookie,
  // synchronous SQLite reads). The check for ADMIN_KEY must not be prerendered:
  // unlike the branches below it calls no request-time API, so a build without
  // ADMIN_KEY (CI has none) would otherwise bake the "not configured" branch
  // into a fully static /admin page that later deploys keep serving.
  await connection();

  if (!isAdminConfigured()) {
    return (
      <div role="alert" className="alert alert-warning">
        <span>服务端未配置 ADMIN_KEY，管理后台不可用。</span>
      </div>
    );
  }

  if (!(await hasAdminSession())) {
    return <AdminLogin searchParams={searchParams} />;
  }

  return <AdminDashboard searchParams={searchParams} />;
}
