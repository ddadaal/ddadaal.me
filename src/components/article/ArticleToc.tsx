"use client";

import { TocEntry as LibTocEntry } from "@stefanprobst/rehype-extract-toc";
import React, { useEffect } from "react";
import { MdToc } from "react-icons/md";
import { Localized } from "src/i18n";

export type TocEntry = Omit<LibTocEntry, "value"> & { value: string | React.ReactNode };

function isWindowBetween(element: HTMLElement | null): boolean {
  return !!element && element.getBoundingClientRect().top >= 2;
}

const MAX_DEPTH = 3;

const TocMenuEntry = ({ entry: { depth, value, children, id } }: { entry: TocEntry }) => {

  return (
    <li className="w-full text-sm">
      <a
        className="transition hover:bg-base-300 rounded w-full flex p-1"
        data-tocid={id}
        href={"#" + id}
      >
        {value}
      </a>
      {(depth <= MAX_DEPTH && children && children.length > 0) ? (
        <ul className="pl-2 border-l border-neutral">
          {children.map((x) => <TocMenuEntry key={x.id} entry={x} />)}
        </ul>
      ) : undefined}
    </li>
  );
};

interface Props {
  toc: TocEntry[];
  hasSummary: boolean;
}

export const ArticleToc = ({ toc, hasSummary }: Props) => {

  useEffect(() => {

    const tocItemElements = Array.from(document.querySelectorAll("[data-tocid]"));

    if (tocItemElements.length === 0) { return; }

    let currentIndex = 0;

    const setActive = (index: number): void => {
      if (currentIndex === index) { return; }
      tocItemElements[currentIndex].classList.remove("active");
      currentIndex = index;
      tocItemElements[index].classList.add("active");
    };

    const onScroll = (): void => {
      for (let i = 0; i < tocItemElements.length - 1; i++) {
        if (isWindowBetween(document.getElementById(tocItemElements[i + 1].getAttribute("data-tocid")!))) {
          setActive(i);
          return;
        }
      }
      setActive(tocItemElements.length - 1);
    };


    tocItemElements[0].classList.add("active");

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (hasSummary) {
    toc = [
      { depth: 0, value: (
        <span className="font-bold">
          <Localized id="articlePage.toc.summary" />
        </span>
      ), id: "summary" },
      ...toc,
    ];
  }

  // TODO make overflow menu item break line
  return (
    <div className="px-1 sticky top-24 max-h-[60vh] overflow-auto">
      <div className="flex space-x-1 items-center py-2">
        <MdToc />
        <span>
          <Localized id="articlePage.toc.title" />
        </span>
      </div>
      <ul className="pl-2 border-l border-neutral">
        {
          toc.map((x) => <TocMenuEntry key={x.id} entry={x} />)
        }
      </ul>
    </div>
  );
};
