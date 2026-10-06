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
