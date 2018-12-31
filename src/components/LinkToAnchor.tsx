import * as React from "react";

interface Props extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  offset?: string | (() => number);
}

export default class LinkToAnchor extends React.Component<Props> {

  smoothScroll = (e) => {
    e.preventDefault()
    let offset = () => 0;
    if (typeof this.props.offset !== 'undefined') {
      if (typeof this.props.offset === 'function') {
        offset = this.props.offset;
      } else {
        offset = () => parseInt(this.props.offset as string);
      }
    }

    const id = e.currentTarget.getAttribute('href').slice(1);
    window.scroll({
      top: document.getElementById(id)!.offsetTop - offset(),
      behavior: 'smooth'
    });

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }
  render() {
    const { offset, ...rest } = this.props;
    return (
      <a {...rest} onClick={this.smoothScroll} />
    )
  }
}
