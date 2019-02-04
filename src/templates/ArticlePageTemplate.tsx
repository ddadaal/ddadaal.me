import * as React from "react";
import Helmet from "react-helmet";

import Page from "@/layouts/components/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import { Link, navigate } from "gatsby";
import { FaBackward } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import LanguageSelector from "@/components/LanguageSelector";
import { getLanguage } from "@/i18n/definition";;
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import TocPanel from "@/components/Article/TocPanel";
import { Row, Col } from "reactstrap";
import ArticleFrontmatter from "@/components/Article/ArticleFrontmatter";
import ArticleContentDisplay from "@/components/Article/ArticleContentDisplay";
import { HtmlAst } from "@/models/HtmlAst";
import ArticlePageHeader from "@/components/Article/ArticlePageHeader";

interface Props extends WithStoresProps {
  pageContext: {
    id: string;
    lang: string;
    htmlAst: HtmlAst;
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

const ArticleHeader = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.4em;
  padding: 4px 0;
`;

export default withStores(I18nStore, ArticleStore)(function ArticlePageTemplate(props: Props) {

  const articleStore = props.useStore(ArticleStore);

  const i18nStore = props.useStore(I18nStore);

  const { id, lang, htmlAst, headings } = props.pageContext;

  const language = i18nStore.getLanguage(lang)!;


  const { frontmatter: { title, date, tags, hide_heading, no_toc }, path, wordCount: { words: wordCount }, excerpt } = articleStore.getNodeFromLang(id, language);

  const langPathMap = articleStore.getLangPathMap(props.pageContext.id);

  return (
    <div>
      <Helmet
        title={`${title} - VicBlog`}
        meta={[
          { name: "og:title", content: title },
          { name: "og:description", content: excerpt },
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
          { name: "og:article:published_time", content: date },
          ...(tags || []).map((x) => ({
            name: "og:article:tag",
            content: x
          }))
        ]}
      />
      {!hide_heading &&
        (
          <ArticlePageHeader title={title} id={id} tags={tags} date={date} wordCount={wordCount} currentArticleLanguage={lang} />
        )
      }
      <Page>
        <Row>
          <Col md={no_toc ? 12 : 9} sm={12} >
            <ArticleContentDisplay
              htmlAst={htmlAst}
              headings={headings}
            />
          </Col>
          {
            !no_toc
            && (
              <Col md={3} className="d-none d-md-block" >
                <TocPanel headings={headings} />
              </Col>
            )
          }
        </Row>
        {/* <Share articleId={id} /> */}
        <CommentPanel
          language={i18nStore.language.gitalkLangId}
          articleId={id}
          articleTitle={title}
        />
      </Page>
    </div>
  );
});
