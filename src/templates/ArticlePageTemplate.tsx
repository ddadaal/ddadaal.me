import React, { useEffect } from "react";
import Page from "@/layouts/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import MetadataStore from "@/stores/MetadataStore";
import TocPanel from "@/components/Article/TocPanel";
import { Row, Col } from "reactstrap";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import { HtmlAst } from "@/models/HtmlAst";
import ArticlePageBanner from "@/components/Article/ArticlePageBanner";
import { useStore } from "simstate";
import ArticleStore from "@/stores/ArticleStore";
import styled, { keyframes } from "styled-components";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import RelatedArticles from "@/components/Article/RelatedArticles";
import { heights } from "@/styles/variables";
import BannerLayout from "@/layouts/BannerLayout";
import { useI18nStore, languageIds } from "@/i18n";
import { PageMetadata } from "@/components/PageMetadata";
import { DateTime } from "luxon";
import useConstant from "@/utils/useConstant";
import { fromArticleTime } from "@/utils/datetime";

interface Props {
  pageContext: {
    id: string;
    lang: string;
    htmlAst: HtmlAst;
    headings: Heading[];
  };
  location: Location;
}


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

const PageComponent: React.FC<{ hasHeader: boolean; children: React.ReactNode }> = ({ hasHeader, children }) => {
  return hasHeader ? <PageWithHeader>{children}</PageWithHeader> : <Page>{children}</Page>;
};

const RootLayout: React.FC<{ article: ArticleNode; lang: string; date: DateTime }> = ({ article, children, lang, date }) => {

  const {
    frontmatter: {
      id, title, tags, hide_heading,
    }, timeToRead } = article;

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
          timeToRead={timeToRead}
          currentArticleLanguage={lang}
        />
      }>
        {children}
      </BannerLayout>
    );
  }
}

const ArticlePageTemplate: React.FC<Props> = (props) => {

  const i18nStore = useI18nStore();
  const metadataStore = useStore(MetadataStore);
  const articleStore = useStore(ArticleStore);

  const { id, lang, htmlAst, headings } = props.pageContext;

  const articleNode = metadataStore.getArticleOfLang(id, lang);

  useEffect(() => {
    articleStore.setArticle(articleNode);
    return () => {
      articleStore.setArticle(null);
    };
  }, [articleNode]);

  const { path, excerpt, frontmatter: {
    title, date, tags, hide_heading, no_toc, related,
  } } = articleNode;

  const langPathMap = metadataStore.getLangPathMap(props.pageContext.id);

  const publishedTime = useConstant(() => fromArticleTime(date));

  return (
    <RootLayout article={articleNode} lang={lang} date={publishedTime}>
      <div>
        <PageMetadata
          title={title}
          description={excerpt}
          url={path}
          locale={languageIds[lang]}
          meta={[
            { name: "og:type", content: "article" },
            { name: "og:article:published_time", content: publishedTime.toISO() },
            ...(tags || []).map((x) => ({
              name: "og:article:tag",
              content: x,
            })),
            ...Object.keys(langPathMap)
              .filter((x) => x !== lang)
              .map((x) => ({
                name: "og:locale:alternate",
                content: languageIds[x],
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
                    <TocPanel headings={headings} />
                  </StickySidePanel>
                </Col>
              )
            }
          </Row>

          {/* <Share articleId={id} /> */}
          {related ? <RelatedArticles ids={related} /> : null}
          <hr />
          <CommentPanel
            language={i18nStore.currentLanguage.gitalkLangId}
            articleId={id}
            articleTitle={title}
          />
        </PageComponent>
      </div>
    </RootLayout>
  );
}

export default ArticlePageTemplate;

const StickySidePanel = styled.div`
  position: sticky;
  top: ${heights.header + 32}px;
`;
