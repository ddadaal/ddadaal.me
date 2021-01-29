import React from "react";
import { lang, languageNames } from "@/i18n";
import { LocalizedString, useLocalized } from "simstate-i18n";
import styled from "styled-components";
import { FaCalendarPlus, FaTags, FaGlobe, FaUserClock, FaFileWord, FaCalendar } from "react-icons/fa";
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
  lastUpdated?: DateTime;
  timeToRead: number;
  wordCount: number;
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

const DATE_FORMAT = "yyyy-MM-dd HH:mm";

const ArticleFrontmatter: React.FC<Props> = (props) => {
  const { date, timeToRead, tags, articleId, lastUpdated, currentArticleLanguage, setItemProp, wordCount } = props;

  const dateString = useConstant(() => date.toFormat(DATE_FORMAT));
  const lastUpdatedString = useConstant(() => lastUpdated?.toFormat(DATE_FORMAT));

  const createTimeTitle = useLocalized(root.date) as string;
  const lastUpdatedTimeTitle = useLocalized(root.lastUpdated) as string;

  return (
    <ContainerRow>

      {tags && <Tags ><FaTags />{tags.map((tag) => <ArticleTag tag={tag} key={tag} />)}</Tags>}
      <Span title={createTimeTitle} >
        <FaCalendar />
        { setItemProp
          ? <time itemProp="datePublished" dateTime={date.toISO()}>{dateString}</time>
          : dateString
        }
      </Span>
      {
        lastUpdatedString
          ? (
            <Span title={lastUpdatedTimeTitle}>
              <FaCalendarPlus />
              { setItemProp
                ? <time itemProp="dateModified" dateTime={lastUpdated!.toISO()}>{lastUpdatedString}</time>
                : lastUpdatedString
              }
            </Span>
          ) : undefined
      }
      <Span>
        <FaFileWord />
        <LocalizedString id={root.wordCount} replacements={[wordCount]} />
      </Span>
      <Span>
        <FaUserClock />
        <LocalizedString id={root.timeToRead} replacements={[timeToRead]} />
      </Span>
      <Span>
        <FaGlobe />
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
        {languageNames[currentArticleLanguage]}
      </DisabledLangLink>
      {Array.from(langPathMap.entries()).map(([lang, path]) => (
        <LangLink key={lang} to={path}>{languageNames[lang]}</LangLink>
      ))}
    </>
  );
};
