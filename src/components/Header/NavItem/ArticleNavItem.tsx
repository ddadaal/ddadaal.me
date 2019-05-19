import React from "react";
import { useStore } from "simstate";
import { LocationStore } from "@/stores/LocationStore";
import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import { Link } from "gatsby";
import NavLink from "@/components/Header/NavLink";
import styled from "styled-components";
import { DropdownItem } from "reactstrap";

function doNothing() {

}

const StyledDropdownItem = styled(DropdownItem)<{ active: boolean}>`
  .nav-link {
    color: ${({ active }) => active ? "white" : "black"}!important;

  }

  .active > a {
    color: white !important;
  }

  .nav-link:hover {
    color: white !important;
  }
` as React.ComponentType<{ active: boolean }>;

const ArticleNavItem = (props: {
  children?: React.ReactNode;
  articleId: string;
  onClick?(): void;
}) => {

  const { children, articleId, onClick } = props;

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);
  const { pathname } = useStore(LocationStore);

  const { language } = i18nStore;

  const node = metadataStore.getArticleOfLang(articleId, language);

  const targetPageUrlParts = node.path.split("/");
  targetPageUrlParts.pop();

  const active = pathname.startsWith(targetPageUrlParts.join("/"));

  return (
    <StyledDropdownItem active={active}>
      <NavLink to={node.path} onClick={onClick || doNothing}>
        {children}
      </NavLink>
    </StyledDropdownItem>
  );

};

export default ArticleNavItem;
