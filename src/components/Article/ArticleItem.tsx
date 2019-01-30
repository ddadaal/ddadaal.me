import * as React from "react";
import { Link, navigate } from "gatsby";
import styled from "styled-components";
import TagGroup from "./TagGroup";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import { getLanguage } from "@/i18n/definition";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import ArticleFrontmatter from "./ArticleFrontmatter";
import { ArticleNode } from "@/models/ArticleNode";

interface Props extends WithStoresProps {
  article: ArticleNode;
}

const StyledPost = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 3em;
  }
`;

const root = lang.articleItem;

const LangLink = styled(Link)`
  margin-right: 4px;
`;

const StyledH = styled.h2`
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const StyledTitle = (props: { children: React.ReactNode, to: string }) => {
  return (
    <StyledH onClick={() => navigate(props.to)}>{props.children}</StyledH>
  )
};

export default withStores(I18nStore, ArticleStore)(function ArticleItem(props: Props) {
  const { article, useStore } = props;
  const { frontmatter: { id, title, tags, date }, timeToRead, wordCount: { words }, excerpt } = article;
  const { language } = useStore(I18nStore);
  const articleStore = useStore(ArticleStore);

  const langPaths = articleStore.getLangPathMap(id);

  return (
    <StyledPost>
      <StyledTitle to={langPaths[language.id] || Object.values(langPaths)[0]}>
        {title}
      </StyledTitle>

      <ArticleFrontmatter date={date} wordCount={words} timeToRead={timeToRead} tags={tags} />

      <p>{excerpt}</p>
      <p>
        <I18nString id={root.availableLanguages} />
        {Object.entries(langPaths).map(([lang, path]) => (
          <LangLink key={lang} to={path}>{getLanguage(lang).name}</LangLink>
        ))}
      </p>
      <hr />
    </StyledPost>
  );
});
