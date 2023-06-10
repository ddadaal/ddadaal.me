"use client";

import { Toc } from "@stefanprobst/rehype-extract-toc";
import { useEffect } from "react";
import { MdToc } from "react-icons/md";
import { Localized } from "src/i18n";

interface Props {
  toc: Toc;
}

function isWindowBetween(element: HTMLElement | null): boolean {
  return !!element && element.getBoundingClientRect().top >= 2;
}

export const ArticleToc = ({ toc }: Props) => {

  useEffect(() => {

    const tocItemElements: HTMLElement[] = [];

    let currentIndex = 0;

    const setActive = (index: number): void => {
      if (currentIndex === index) { return; }
      tocItemElements[currentIndex].classList.remove("active");
      currentIndex = index;
      tocItemElements[index].classList.add("active");
    };

    const onScroll = (): void => {

      for (let i = 0; i < toc.length - 1; i++) {
        if (isWindowBetween(document.getElementById(toc[i + 1].id!))) {
          setActive(i);
          return;
        }
      }
      setActive(toc.length - 1);
    };

    if (toc.length === 0) { return; }

    toc.forEach((heading) => {
      // add heading element
      const tocEl = document.getElementById(`tocitem-${heading.id}`);
      if (tocEl) {
        tocItemElements.push(tocEl);

      }
    });

    setActive(0);

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [toc]);


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
              toc.map((x, i) => (
                <li key={i} style={{ paddingLeft: (x.depth - 1) * 4 }}>
                  <a id={`tocitem-${x.id}`} href={"#" + x.id}>
                    {x.value}
                  </a>
                </li>
              ))
            }
          </ul>
        </li>
      </ul>
    </div>
  );
};
