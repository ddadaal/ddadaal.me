import React, { useCallback } from "react";
import { heights } from "@/styles/variables";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  targetAnchor: string;
}

function absoluteTopPosition(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset;
  return rect.top + scrollTop;
}

const ScrollLinkToAnchor: React.FC<Props> = ({ targetAnchor, onClick, ...rest }) => {
  const aOnClick = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const element = document.getElementById(targetAnchor);

    if (element) {
      window.scroll({
        top: absoluteTopPosition(element) - heights.header,
        behavior: "smooth",
      });

    }

    if (onClick) {
      onClick(e);
    }
  }, [targetAnchor, onClick])

  return (
    <a {...rest} onClick={aOnClick} />
  );
}

export default ScrollLinkToAnchor;
