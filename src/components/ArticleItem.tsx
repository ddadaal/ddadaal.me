import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import TagGroup from "./TagGroup";
import { I18nConsumer } from "../i18n/I18nContext";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import { getLanguage } from "../i18n/definition";

interface Props {
  idName: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  langPaths: { [lang: string]: string }
}

const StyledPost = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 3em;
  }
`;

const root = lang().articleItem;

const LangLink = styled(Link)`
  margin-right: 4px;
`;

export default function ArticleItem(props: Props) {
  const { title, excerpt, date, tags, langPaths } = props;

  return (
    <StyledPost>
      <I18nConsumer>
        {({ language }) => {
          return (
            <Link to={langPaths[language.id] || langPaths[Object.keys(langPaths)[0]]}>
              <h1>{title}</h1>
            </Link>
          );
        }}
      </I18nConsumer>

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
}
