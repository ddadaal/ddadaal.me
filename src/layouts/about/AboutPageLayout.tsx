import React from "react";
import lang from "@/i18n/lang";
import { FaBookOpen, FaGlobe, FaMale } from "react-icons/fa";
import SubmenuLayout from "@/layouts/SubmenuLayout";
import { HtmlAst } from "@/models/HtmlAst";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { matchLangWithCurrentLanguage } from "@/stores/MetadataStore";
import { Heading, ArticleNode } from "@/models/ArticleNode";
import { CommentPanelWithCurrentLanguage } from "@/components/Article/CommentPanel";
import styled from "styled-components";

const root = lang.about;

const links = [
  { textId: root.odyssey, Icon: FaBookOpen, to: "odyssey" },
  { textId: root.project, Icon: FaGlobe, to: "project" },
  { textId: root.me, Icon: FaMale, to: "me" },
];

interface Props {
  articleId: string;
  articleTitle: string;
  allArticles: { htmlAst: HtmlAst; headings: Heading[]; frontmatter: { lang: string; title: string; date: string; }}[];
}

export default function AboutPageLayout(props: Props) {

  const i18nStore = useStore(I18nStore);

  const localizedArticle = props.allArticles.find((article) =>
    matchLangWithCurrentLanguage(article.frontmatter.lang, i18nStore.language)) || props.allArticles[0];

  return (
    <SubmenuLayout navPoints={links} baseUrl="/about/" menuTextId={root.title}>
      <SubmenuLayout.Title>{localizedArticle.frontmatter.title}</SubmenuLayout.Title>
      <Date>{localizedArticle.frontmatter.date}</Date>
      <ArticleContentDisplay
        htmlAst={localizedArticle.htmlAst}
        headings={localizedArticle.headings}
      />
      <CommentPanelWithCurrentLanguage articleId={props.articleId} articleTitle={props.articleTitle} />
    </SubmenuLayout>
  );
}

export interface AboutPageCommonProps {
  data: {
    allMarkdownRemark: {
      nodes: (ArticleNode & { htmlAst: HtmlAst; headings: Heading[]; })[];
    };
  };
}

const Date = styled.p`
  color: gray;
`;
