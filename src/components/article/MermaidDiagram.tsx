"use client";

import mermaid from "mermaid";
import { useCallback, useEffect, useRef, useState } from "react";

let idCounter = 0;

const DARK_THEMES = new Set(["dark", "business", "luxury", "cyberpunk"]);

function getMermaidTheme(): "dark" | "default" {
  const daisyTheme = document.documentElement.getAttribute("data-theme");
  if (!daisyTheme) {
    // "auto" — follow system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "default";
  }
  return DARK_THEMES.has(daisyTheme) ? "dark" : "default";
}

interface Props {
  children?: React.ReactNode;
}

export function MermaidDiagram({ children }: Props) {
  const code = typeof children === "string" ? children : "";
  const [svg, setSvg] = useState<string>("");
  const idRef = useRef(`mermaid-${idCounter++}`);

  const render = useCallback(() => {
    mermaid.initialize({ startOnLoad: false, theme: getMermaidTheme() });
    mermaid.render(idRef.current, code).then(({ svg: rendered }) => {
      setSvg(rendered);
    }).catch(console.error);
  }, [code]);

  useEffect(() => {
    render();

    // Re-render when the daisyUI theme attribute changes
    const observer = new MutationObserver(render);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Re-render in "auto" mode when OS color scheme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", render);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", render);
    };
  }, [render]);

  if (!svg) return null;

  // mermaid.render returns trusted SVG — the source is always the blog author's own content
  return <div dangerouslySetInnerHTML={{ __html: svg }} className="overflow-x-auto my-4" />;
}
