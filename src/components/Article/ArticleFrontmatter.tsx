import React from "react";
import { lang, getLanguage } from "@/i18n";
import { LocalizedString } from "simstate-i18n";
import styled from "styled-components";
import { FaCalendarAlt, FaTags, FaGlobe, FaUserClock } from "react-icons/fa";
import { breakpoints } from "@/styles/variables";
import { Link } from "gatsby";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import ArticleTag from "@/components/Article/TagGroup/ArticleTag";
import { DateTime } from "luxon";
import useConstant from "@/utils/useConstant";

interface Props {
  articleId: string;
  date: DateTime;
  timeToRead: number;
  tags: string[] | null;
  currentArticleLanguage: string;
  setItemProp: boolean;
}

const root = lang.articleFrontmatter;

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
  const { date, timeToRead, tags, articleId, currentArticleLanguage, setItemProp } = props;

  const dateString = useConstant(() => date.toFormat("yyyy-MM-dd HH:mm 'UTC'Z"));

  return (
    <ContainerRow>

      {tags && <Tags ><FaTags />{tags.map((tag) => <ArticleTag tag={tag} key={tag} />)}</Tags>}
      <Span title={dateString} >
        <FaCalendarAlt />
        { setItemProp
          ? <time itemProp="datePublished" dateTime={date.toISO()}>{dateString}</time>
          : dateString
        }
      </Span>
      {/* <Span><FaClock /><LocalizedString id={root.timeToRead} replacements={[timeToRead]} /></Span>  */}
      <Span>
        <FaUserClock />
        <LocalizedString id={root.timeToRead} replacements={[timeToRead]} />
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
        {getLanguage(currentArticleLanguage)!.name}
      </DisabledLangLink>
      {Array.from(langPathMap.entries()).map(([lang, path]) => (
        <LangLink key={lang} to={path}>{getLanguage(lang)!.name}</LangLink>
      ))}
    </>
  );
};
