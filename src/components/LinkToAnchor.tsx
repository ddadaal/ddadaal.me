import * as React from "react";
import { heights } from "@/styles/variables";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
}

function absoluteTopPosition(el: Element) {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset;
  return rect.top + scrollTop;
}

export default class LinkToAnchor extends React.Component<Props> {

  smoothScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()


    const id = e.currentTarget.getAttribute('href')!.slice(1);
    window.scroll({
      top: absoluteTopPosition(document.getElementById(id)!) - heights.header,
      behavior: 'smooth'
    });

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    return (
      <a {...this.props} onClick={this.smoothScroll} />
    )
  }
}
