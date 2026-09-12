"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Localized } from "src/i18n";

interface ViewCount {
  views: string;
}

interface Props {
  articleId: string;
  recordView?: boolean;
  hidden?: boolean;
}

export const ArticleViewCount = ({ articleId, recordView = false, hidden = false }: Props) => {
  const pathname = usePathname();
  const visitKey = `${recordView ? "record" : "read"}:${articleId}:${pathname}`;
  const visit = useRef<{ key: string; request: Promise<ViewCount> } | null>(null);
  const [result, setResult] = useState<{ key: string; views: string } | null>(null);

  useEffect(() => {
    let active = true;

    // Reuse the request when React Strict Mode re-runs this effect. A new
    // navigation or mount still records a new page view on article pages.
    // List items only read the current total.
    if (visit.current?.key !== visitKey) {
      const request = fetch(`/api/articles/${encodeURIComponent(articleId)}/views`, {
        method: recordView ? "POST" : "GET",
        cache: "no-store",
        headers: recordView ? { "Content-Type": "application/json" } : undefined,
        body: recordView
          ? JSON.stringify(
              (() => {
                const query = new URLSearchParams(window.location.search);
                return {
                  path: window.location.pathname,
                  referrer: document.referrer || undefined,
                  utmSource: query.get("utm_source") ?? undefined,
                  utmMedium: query.get("utm_medium") ?? undefined,
                  utmCampaign: query.get("utm_campaign") ?? undefined,
                };
              })(),
            )
          : undefined,
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("View count unavailable");
        }
        return (await response.json()) as ViewCount;
      });
      visit.current = { key: visitKey, request };
    }

    void visit.current.request
      .then(({ views }) => {
        if (active && typeof views === "string" && /^\d+$/.test(views)) {
          setResult({ key: visitKey, views });
        }
      })
      .catch(() => {
        // Analytics must not prevent reading an article. Do not retry writes:
        // the server may have committed a view before the response was lost.
      });

    return () => {
      active = false;
    };
  }, [articleId, recordView, visitKey]);

  if (hidden || result?.key !== visitKey) {
    return null;
  }

  return (
    <div className="flex items-center">
      <FaEye aria-hidden />
      <span className="mx-0.5">
        <Localized id="articleFrontmatter.views" args={[result.views]} />
      </span>
    </div>
  );
};
