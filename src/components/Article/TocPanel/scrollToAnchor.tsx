import React from "react";

import { heights } from "@/styles/variables";

function absoluteTopPosition(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset;
  return rect.top + scrollTop;
}

export const scrollToAnchor = (targetAnchor: string) => {
  return (e: React.MouseEvent) => {
    e.preventDefault();

    const element = document.getElementById(targetAnchor);

    if (element) {
      window.scroll({
        top: absoluteTopPosition(element) - heights.header,
        behavior: "smooth",
      });

    }
  };
};
