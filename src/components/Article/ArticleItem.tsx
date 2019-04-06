import React from "react";
import { navigate } from "gatsby";
import styled from "styled-components";
import lang from "@/i18n/lang";
import { I18nStore } from "@/stores/I18nStore";
import { MetadataStore } from "@/stores/MetadataStore";
import ArticleFrontmatter from "./ArticleFrontmatter";
import { ArticleNode } from "@/models/ArticleNode";
import { useStore } from "simstate";

interface Props {
  article: ArticleNode;
  currentArticleLanguage: string;
}

const StyledPost = styled.div`
  margin-bottom: 24px;
`;

const root = lang.articleItem;

const StyledH = styled.h2`
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }

  font-size: 30px;
  padding: 4px 0;
  /* font-weight: bold; */
`;

const StyledTitle = (props: { children: React.ReactNode, to: string }) => {
  return (
    <StyledH onClick={() => navigate(props.to)}>{props.children}</StyledH>
  );
};

export default function ArticleItem(props: Props) {
  const { article, currentArticleLanguage } = props;
  const { frontmatter: { id, title, tags, date }, wordCount: { words }, excerpt } = article;

  const { language } = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  const langPaths = metadataStore.getLangPathMap(id);

  return (
    <StyledPost>
      <StyledTitle to={langPaths.get(language.id) || langPaths.values().next().value}>
        {title}
      </StyledTitle>

      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        date={date}
        wordCount={words}
        tags={tags}
        articleId={id}
      />

      <p>{excerpt}</p>
      <hr />
    </StyledPost>
  );
}
