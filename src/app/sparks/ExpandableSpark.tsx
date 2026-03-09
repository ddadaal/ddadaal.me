"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { Localized } from "src/i18n";

const MAX_HEIGHT = 200;

export function ExpandableSpark({ children }: { children: ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight > MAX_HEIGHT) {
      setOverflows(true);
    }
  }, []);

  return (
    <div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded || !overflows ? undefined : MAX_HEIGHT }}
      >
        {children}
      </div>
      {overflows && !expanded && (
        <div className="relative -mt-12 pt-12 bg-gradient-to-t from-base-100 to-transparent">
          <button
            className="text-sm text-primary hover:underline cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            <Localized id="sparksPage.expand" />
          </button>
        </div>
      )}
      {overflows && expanded && (
        <button
          className="text-sm text-primary hover:underline cursor-pointer mt-2"
          onClick={() => setExpanded(false)}
        >
          <Localized id="sparksPage.collapse" />
        </button>
      )}
    </div>
  );
}
