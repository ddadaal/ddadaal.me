"use client";

import { Toc, TocEntry } from "@stefanprobst/rehype-extract-toc";
import { useEffect } from "react";
import { MdToc } from "react-icons/md";
import { Localized } from "src/i18n";


function isWindowBetween(element: HTMLElement | null): boolean {
  return !!element && element.getBoundingClientRect().top >= 2;
}

const MAX_DEPTH = 3;

const TocMenuEntry = ({ entry: { depth, value, children, id } }: { entry: TocEntry }) => {

  return (
    <li>
      <a data-tocid={id} href={"#" + id}>
        {value}
      </a>
      {(depth <= MAX_DEPTH && children && children.length > 0) ? (
        <ul>
          {children.map((x) => <TocMenuEntry key={x.id} entry={x} />)}
        </ul>
      ) : undefined}
    </li>
  );
};

interface Props {
  toc: Toc
}

export const ArticleToc = ({ toc }: Props) => {

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


  // TODO make overflow menu item break line
  return (
    <div className="px-1 sticky top-24">
      <ul className="menu max-w-full overflow-auto">
        <li>
          <div className="menu-title flex space-x-1 items-center py-2">
            <MdToc />
            <span>
              <Localized id="articlePage.toc" />
            </span>
          </div>
          <ul className="menu">
            {
              toc.map((x) => <TocMenuEntry key={x.id} entry={x} />)
            }
          </ul>
        </li>
      </ul>
    </div>
  );
};
