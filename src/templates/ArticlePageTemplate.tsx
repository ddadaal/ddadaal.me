import React from "react";
import Helmet from "react-helmet";

import Page from "@/layouts/components/Page";
import CommentPanel from "@/components/Article/CommentPanel";
import { Heading } from "@/models/ArticleNode";
import styled from "styled-components";
import langRoot from "@/i18n/lang";

import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import TocPanel from "@/components/Article/TocPanel";
import { Row, Col } from "reactstrap";
import ArticleContentDisplay from "@/components/Article/ArticleContentDisplay";
import { HtmlAst } from "@/models/HtmlAst";
import ArticlePageHeader from "@/components/Article/ArticlePageHeader";
import { useStore } from "simstate";

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

export default function ArticlePageTemplate(props: Props) {

  const articleStore = useStore(ArticleStore);

  const i18nStore = useStore(I18nStore);

  const { id, lang, htmlAst, headings } = props.pageContext;

  const language = i18nStore.getLanguage(lang)!;

  const { frontmatter: {
    title, date, tags, hide_heading, no_toc,
  }, path, wordCount: { words: wordCount }, excerpt } = articleStore.getNodeFromLang(id, language);

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
            .map((x) => ({
              name: "og:locale:alternate",
              content: i18nStore.getLanguage(x)!.detailedId,
            })),
          { name: "og:site_name", content: "VicBlog" },
          { name: "og:article:published_time", content: date },
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
};
