import classNames from "classnames";
import { createElement } from "react";
import { FaLink } from "react-icons/fa";

interface HeadingWithLinkProps {
  element: "h1" | "h2" | "h3";
  props: React.JSX.IntrinsicElements["h1"] ;
  anchorLinkClassName?: string;
}

export const HeadingWithLink = (props: HeadingWithLinkProps) => {
  return createElement(props.element, props.props, [
    <a href={"#" + (props.props.id ?? "")} className={classNames("mr-1", props.anchorLinkClassName)} key={props.props.id}>
      <FaLink className="inline-block opacity-20 hover:opacity-60" size={16} />
    </a>,
    props.props.children,
  ]);
};
