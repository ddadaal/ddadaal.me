import React, { useLayoutEffect, useEffect } from "react";
import Helmet from "react-helmet";

import Page from "@/layouts/components/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import { Heading } from "@/models/ArticleNode";
import langRoot from "@/i18n/lang";

import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import TocPanel from "@/components/Article/TocPanel";
import { Row, Col } from "reactstrap";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import { HtmlAst } from "@/models/HtmlAst";
import ArticlePageHeader from "@/components/Article/ArticlePageHeader";
import { useStore } from "simstate";
import { ArticleStore } from "@/stores/ArticleStore";
import styled, { keyframes } from "styled-components";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";

interface Props {
  pageContext: {
    id: string;
    lang: string;
    htmlAst: HtmlAst;
    headings: Heading[];
  };
  location: Location;
}

const root = langRoot.articlePage;

const enterAnimation = keyframes`
  from {
    opacity: 0;
  }
  
  to {
    opacity: 1;
  }
`;

const PageWithHeader = styled(Page)`
   animation: ${enterAnimation} 0.2s ease-in-out;
`;

function PageComponent({hasHeader, children}: { hasHeader: boolean, children: React.ReactNode }) {
  return hasHeader ? <PageWithHeader>{children}</PageWithHeader> : <Page>{children}</Page>;
}

export default function ArticlePageTemplate(props: Props) {

  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);
  const articleStore = useStore(ArticleStore);

  const {id, lang, htmlAst, headings} = props.pageContext;

  const language = i18nStore.getLanguage(lang)!;

  const articleNode = metadataStore.getArticleOfLang(id, language);

  useEffect(() => {
    articleStore.setArticle(articleNode);
    return () => {
      articleStore.setArticle(null);
    };
  }, [articleNode]);

  const {
    frontmatter: {
      title, date, tags, hide_heading, no_toc,
    }, path, wordCount: {words: wordCount}, excerpt,
  } = articleNode;

  const langPathMap = metadataStore.getLangPathMap(props.pageContext.id);

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <div>
        <Helmet
          title={`${title} - VicBlog`}
          meta={[
            {name: "og:title", content: title},
            {name: "og:description", content: excerpt},
            {name: "og:type", content: "article"},
            {name: "og:url", content: `${metadataStore.baseUrl}${path}`},
            {name: "og:locale", content: language.detailedId},
            ...Object.keys(langPathMap)
              .filter((x) => x !== lang)
              .map((x) => ({
                name: "og:locale:alternate",
                content: i18nStore.getLanguage(x)!.detailedId,
              })),
            {name: "og:site_name", content: "VicBlog"},
            {name: "og:article:published_time", content: date},
            ...(tags || []).map((x) => ({
              name: "og:article:tag",
              content: x,
            })),
          ]}
        />
        {!hide_heading &&
        (
          <ArticlePageHeader
            title={title}
            id={id}
            tags={tags}
            date={date}
            wordCount={wordCount}
            currentArticleLanguage={lang}
          />
        )
        }
        <PageComponent hasHeader={!hide_heading}>
          <Row>
            <Col md={no_toc ? 12 : 9} sm={12}>
              <ArticleContentDisplay
                htmlAst={htmlAst}
                headings={headings}
              />
            </Col>
            {
              !no_toc
              && (
                <Col md={3} className="d-none d-md-block">
                  <TocPanel headings={headings}/>
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
        </PageComponent>
      </div>
    </HeaderFooterLayout>
  );
}
