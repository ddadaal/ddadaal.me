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
    // The admin area sits on the deeper base-200 surface so the base-100 cards
    // read as raised surfaces (in dark themes the two steps are close, so the
    // cards also carry a hairline border).
    <main className="bg-base-200 min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
      </div>
    </main>
  );
}
