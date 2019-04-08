import React from "react";
import langRoot from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import styled, { keyframes } from "styled-components";
import { Badge, Row, Col } from "reactstrap";
import ArticleTagGroup from "@/components/Article/TagGroup";
import { FaCalendarAlt, FaClock, FaFileWord, FaTags, FaGlobe } from "react-icons/fa";
import { breakpoints } from "@/styles/variables";
import { I18nStore } from "@/stores/I18nStore";
import { Link } from "gatsby";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";

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

export default function ArticleFrontmatter(props: Props) {
  const { date, wordCount, tags, articleId, currentArticleLanguage } = props;

  return (
    <ContainerRow>

      {tags && <Tags ><FaTags /><ArticleTagGroup tags={tags} /></Tags>}
      <Span>
        <FaCalendarAlt />
        {date}
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

const LangLink = styled(Link)`

  margin-right: 8px;
`;

const DisabledLangLink = styled.span`
  margin-right: 8px;

`;

const LanguageSwitcher = (props: { currentArticleLanguage: string; articleId: string; }) => {
    const { articleId, currentArticleLanguage } = props;
    const i18nStore = useStore(I18nStore);
    const metadataStore = useStore(MetadataStore);

    const langPathMap = metadataStore.getLangPathMap(articleId);

    const pathOfCurrentLanguage = langPathMap.get(currentArticleLanguage)!!;

    langPathMap.delete(currentArticleLanguage);

    return (
      <>
        <DisabledLangLink>
          {i18nStore.getLanguage(currentArticleLanguage)!!.name}
        </DisabledLangLink>
        {Array.from(langPathMap.entries()).map(([lang, path]) => (
          <LangLink key={lang} to={path}>{i18nStore.getLanguage(lang)!!.name}</LangLink>
        ))}
      </>
    );
  };
