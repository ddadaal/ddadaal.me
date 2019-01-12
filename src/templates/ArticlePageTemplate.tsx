import * as React from "react";
import Helmet from "react-helmet";

import Page from "@/layouts/components/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import TagGroup from "@/components/TagGroup";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import { Link, navigate } from "gatsby";
import { FaBackward } from "react-icons/fa";
import styled from "styled-components";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import LanguageSelector from "@/components/LanguageSelector";
import { getLanguage } from "@/i18n/definition";;
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import TocPanel from "@/components/TocPanel";
import { Row, Col } from "reactstrap";
import { heights } from "@/styles/variables";
import ArticleStatistics from "@/components/Article/ArticleStatistics";


const MarkdownDisplay = styled.div`

  /* h1, h2, h3, h4, h5, h6 {
    margin: 8px 0;
    padding-bottom: 0.3em;
    border-bottom: 1px solid;
  }

  h1 {
    font-size: 2em;
    margin: 12px 0;

  }

  h2 {
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.6em;
  }
  */
`;

interface Props extends WithStoresProps {
  pageContext: {
    id: string;
    lang: string;
    html: string;
    headings: Heading[];
  };
  location: Location;
}

const root = lang.articlePage;

const Headbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default withStores(I18nStore, ArticleStore)(function ArticlePageTemplate(props: Props) {

  const articleStore = props.useStore(ArticleStore);

  const i18nStore = props.useStore(I18nStore);

  const { id, lang, html, headings } = props.pageContext;

  const language = i18nStore.getLanguage(lang)!;


  const { frontmatter, timeToRead, path, wordCount: { words: wordCount } } = articleStore.getNodeFromLang(id, language);

  const langPathMap = articleStore.getLangPathMap(props.pageContext.id);

  return (
    <Page>
      <Helmet
        title={`${frontmatter.title} - VicBlog`}
        meta={[
          { name: "og:title", content: frontmatter.title },
          { name: "og:type", content: "article" },
          { name: "og:url", content: `${articleStore.state.baseUrl}${path}` },
          { name: "og:locale", content: language.detailedId },
          ...Object.keys(langPathMap)
            .filter((x) => x !== lang)
            .map((lang) => ({
              name: "og:locale:alternate",
              content: i18nStore.getLanguage(lang)!.detailedId
            })),
          { name: "og:site_name", content: "VicBlog" },
          { name: "og:article:published_time", content: frontmatter.date },
          ...(frontmatter.tags || []).map((x) => ({
            name: "og:article:tag",
            content: x
          }))
        ]}
      />
      <Headbar>
        <Link to={"/"}>
          <FaBackward />
          <I18nString id={root.backToHome} />
        </Link>
        <LanguageSelector
          allLanguages={
            Object.keys(langPathMap)
              .map((lang) => ({
                id: lang,
                name: getLanguage(lang).name,
              }))
          }
          changeLanguage={(lang) => navigate(langPathMap[lang])}
          currentLanguage={getLanguage(frontmatter.lang).name}
          prompt={<I18nString id={root.selectLang} />}
        />

      </Headbar>
      {!frontmatter.hide_heading &&
        (
          <div>
            <h1>{frontmatter.title}</h1>
            <TagGroup tags={frontmatter.tags} />
            <ArticleStatistics
              date={frontmatter.date}
              wordCount={wordCount}
              timeToRead={timeToRead}
            />


          </div>
        )
      }
      <Row>
        <Col md={frontmatter.no_toc ? 12 : 9} sm={12} >
          <MarkdownDisplay className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
        </Col>
        {
          !frontmatter.no_toc
          && (
            <Col md={3} className="d-none d-md-block" >
              <TocPanel headings={headings} />
            </Col>
          )
        }
      </Row>
      <CommentPanel
        language={language.gitalkLangId}
        articleId={frontmatter.id}
        articleTitle={frontmatter.title}
      />
    </Page>
  );
});
