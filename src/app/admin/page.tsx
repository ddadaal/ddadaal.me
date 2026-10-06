import { Metadata } from "next";
import { Suspense } from "react";
import { generateTitle } from "src/utils/metadata";

import { AdminGate } from "./AdminGate";

export const metadata: Metadata = {
  title: generateTitle("管理后台"),
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// The shell stays synchronous: everything request-bound (cookies, searchParams,
// database reads) lives inside AdminGate behind the Suspense boundary. Admin
// text is intentionally hardcoded Chinese; the page is internal and never
// localized.
export default function AdminPage({ searchParams }: Props) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <div className="skeleton h-12 w-full" />
            <div className="skeleton h-64 w-full" />
          </div>
        }
      >
        <AdminGate searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
