import React from "react";
import { AnchorProps, Anchor } from "grommet";
import { Link } from "gatsby";

declare module "grommet" {
  interface AnchorProps {
    active?: boolean;
  }
}

interface Props extends Omit<AnchorProps, "href" | "as"> {
  href?: string;
  onClick?: () => void;
}

export const AnchorLink: React.FC<Props> = ({ href, onClick, ...props }) => {
  if (href) {
    return (
      <Link to={href} >
        <Anchor {...props}/>
      </Link>
    );
  }else {
    return (
      <Anchor onClick={onClick} {...props}/>
    );
  }
};
