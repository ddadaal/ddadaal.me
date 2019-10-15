import React from "react";
import langRoot from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import styled from "styled-components";
import { FaCalendarAlt, FaFileWord, FaTags, FaGlobe } from "react-icons/fa";
import { breakpoints } from "@/styles/variables";
import { Link } from "gatsby";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import ArticleTag from "@/components/Article/TagGroup/ArticleTag";
import { getLanguage } from "@/i18n/definition";
import { DateTime } from "luxon";

interface Props {
  articleId: string;
  date: string;
  wordCount: number;
  tags: string[] | null;
  currentArticleLanguage: string;
}

const root = langRoot.articleFrontmatter;

const Span = styled.span`
  margin-right: 8px;
  padding-right: 8px;
  margin-bottom: 4px;
  /* border-left: 1px solid black; */
  display: inline-block;

`;

const Tags = styled(Span)`

  /* @media (max-width: ${breakpoints.md}px) {
    display: block;
    margin-bottom: 4px;
  } */
`;

const ContainerRow = styled.div`
  font-size: 0.9em;
  margin: 8px 0;

  vertical-align: center;
`;

const ArticleFrontmatter: React.FC<Props> = (props) => {
  const { date, wordCount, tags, articleId, currentArticleLanguage } = props;

  const dateObject = DateTime.fromSQL(date);

  return (
    <ContainerRow>

      {tags && <Tags ><FaTags />{tags.map((tag) => <ArticleTag tag={tag} key={tag} />)}</Tags>}
      <Span title={dateObject.toFormat("yyyy-MM-dd HH:mm 'UTC'Z")}>
        <FaCalendarAlt />
        {dateObject.toFormat("yyyy-MM-dd HH:mm")}
      </Span>
      {/* <Span><FaClock /><LocalizedString id={root.timeToRead} replacements={[timeToRead]} /></Span>  */}
      <Span>
        <FaFileWord />
        <LocalizedString id={root.wordCount} replacements={[wordCount]} />
      </Span>
      <Span>
        <FaGlobe />
        {/* <LocalizedString id={root.allLanguages} /> */}
        <LanguageSwitcher articleId={articleId} currentArticleLanguage={currentArticleLanguage} />
      </Span>
    </ContainerRow>
  );
}

export default ArticleFrontmatter;

const LangLink = styled(Link)`

  margin-right: 8px;
`;

const DisabledLangLink = styled.span`
  margin-right: 8px;

`;

const LanguageSwitcher: React.FC<{ currentArticleLanguage: string; articleId: string }> = (props) => {
  const { articleId, currentArticleLanguage } = props;
  const metadataStore = useStore(MetadataStore);

  const langPathMap = metadataStore.getLangPathMap(articleId);

  langPathMap.delete(currentArticleLanguage);

  return (
    <>
      <DisabledLangLink>
        {getLanguage(currentArticleLanguage).metadata.name}
      </DisabledLangLink>
      {Array.from(langPathMap.entries()).map(([lang, path]) => (
        <LangLink key={lang} to={path}>{getLanguage(lang).metadata.name}</LangLink>
      ))}
    </>
  );
};
