import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import TagGroup from "./TagGroup";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import { getLanguage } from "../i18n/definition";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";

interface Props extends WithStoresProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
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

export default withStores(I18nStore, ArticleStore)(function ArticleItem(props: Props) {
  const { title, excerpt, date, tags, useStore, id } = props;
  const { language } = useStore(I18nStore);
  const articleStore = useStore(ArticleStore);

  const langPaths = articleStore.getLangPathMap(id);


  return (
    <StyledPost>
      <Link to={langPaths[language.id] || langPaths[Object.keys(langPaths)[0]]}>
        <h1>{title}</h1>
      </Link>

      <TagGroup tags={tags} />
      <p>{date}</p>
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
