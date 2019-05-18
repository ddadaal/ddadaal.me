import React, { useLayoutEffect, useEffect, PropsWithChildren } from "react";
import Helmet from "react-helmet";

import Page from "@/layouts/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import langRoot from "@/i18n/lang";

import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import TocPanel from "@/components/Article/TocPanel";
import { Row, Col } from "reactstrap";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import { HtmlAst } from "@/models/HtmlAst";
import ArticlePageBanner from "@/components/Article/ArticlePageBanner";
import { useStore } from "simstate";
import { ArticleStore } from "@/stores/ArticleStore";
import styled, { keyframes } from "styled-components";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import RelatedArticles from "@/components/Article/RelatedArticles";
import ArticleActions from "@/components/Article/Actions";
import { heights } from "@/styles/variables";
import BannerLayout from "@/layouts/BannerLayout";

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

function RootLayout({article, children, lang}: PropsWithChildren<{ article: ArticleNode; lang: string; }>) {

  const {
    frontmatter: {
      id, title, date, tags, hide_heading, no_toc, related,
    }, path, wordCount: {words: wordCount}, excerpt,
  } = article;

  if (hide_heading) {
    return (
      <HeaderFooterLayout transparentHeader={false}>
        {children}
      </HeaderFooterLayout>
    );
  } else {
    return (
      <BannerLayout transparentHeader={false} banner={
        <ArticlePageBanner
          title={title}
          id={id}
          tags={tags}
          date={date}
          wordCount={wordCount}
          currentArticleLanguage={lang}
        />
      }>
        {children}
      </BannerLayout>
    );
  }
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
      title, date, tags, hide_heading, no_toc, related,
    }, path, wordCount: {words: wordCount}, excerpt,
  } = articleNode;

  const langPathMap = metadataStore.getLangPathMap(props.pageContext.id);

  return (
    <RootLayout article={articleNode} lang={lang}>
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
                  <StickySidePanel>
                    <TocPanel headings={headings}/>
                  </StickySidePanel>
                </Col>
              )
            }
          </Row>

          {/* <Share articleId={id} /> */}
          {related ? <RelatedArticles ids={related}/> : null}
          <hr/>
          <CommentPanel
            language={i18nStore.language.gitalkLangId}
            articleId={id}
            articleTitle={title}
          />
        </PageComponent>
      </div>
    </RootLayout>
  );
}

const StickySidePanel = styled.div`
  position: sticky;
  top: ${heights.header + 32}px;
`;
