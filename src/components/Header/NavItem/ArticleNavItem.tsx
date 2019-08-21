import React from "react";
import NavItem from "@/components/Header/NavItem";
import { usePageLink } from "@/stores/usePageLink";

interface Props {
  Icon: React.ComponentType;
  articleId: string;
  onClick?(): void;
  wrapper: "navItem" | "dropdownItem";
  textId: string;
}

const ArticleNavItem: React.FC<Props> = ({ Icon, articleId, onClick, wrapper, textId }) => {

  const path = usePageLink(articleId);

  const targetPageUrlParts = path.split("/");
  targetPageUrlParts.pop();

  return (
    <NavItem
      wrapper={wrapper}
      onClick={onClick}
      Icon={Icon}
      match={(pathname) => pathname.startsWith(targetPageUrlParts.join("/"))}
      to={path}
      textId={textId}
    />
  );
}

export default ArticleNavItem;
