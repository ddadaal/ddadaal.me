import React from "react";
import LinkNavItem from "@/components/Header/NavItem/LinkNavItem";
import LocalizedString from "@/i18n/LocalizedString";
import { useStore } from "simstate";
import { LocationStore } from "@/stores/LocationStore";
import ArticleNavItem from "@/components/Header/NavItem/ArticleNavItem";

type Props = {
  Icon: React.ComponentType;
  textId: string;
  onClick?(): void;
} & ({
  type: "link";
  matchType: "exact" | "startsWith";
  to: string;
} | {
  type: "article";
  articleId: string;
});

export default function NavItem(props: Props) {
  const children = (
    <>
      <props.Icon />
      <LocalizedString id={props.textId} />
    </>
  );

  if (props.type === "link") {

    return (
      <LinkNavItem matchType={props.matchType} to={props.to} onClick={props.onClick}>
        {children}
      </LinkNavItem>
    );
  } else {
    return (
      <ArticleNavItem articleId={props.articleId} onClick={props.onClick}>
        {children}
      </ArticleNavItem>
    );
  }
}
