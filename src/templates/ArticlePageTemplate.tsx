import * as React from "react";
import Helmet from "react-helmet";

import Page from "../layouts/components/Page";
import CommentPanel from "../components/CommentPanel";
import TagGroup from "../components/TagGroup";
import { ArticleNode } from "../models/ArticleNode";
import { graphql, Link, navigate } from "gatsby";
import { FaBackward } from "react-icons/fa";
import styled from "styled-components";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import LanguageSelector from "../components/LanguageSelector";
import { getLanguage } from "../i18n/definition";
import { ArticleGroups } from "../models/ArticleGroups";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";

const MarkdownDisplay = styled.div`

  h1, h2, h3, h4, h5, h6 {
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

  table * {
    padding: 4px;
  }


  table td {
    border: 1px white solid;
  }

`;

interface Props extends WithStoresProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: {
          name: string;
          url: string;
        }
      };
    };
    markdownRemark: ArticleNode;
  };
  pageContext: {
    id: string;
    lang: string;
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
  const langPathMap = articleStore.getLangPathMap(props.pageContext.id);
  const { language } = props.useStore(I18nStore);

  const { frontmatter, html } = props.data.markdownRemark;

  return (
    <Page>
      <Helmet title={`${frontmatter.title} - VicBlog`} />
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
          currentLanguage={getLanguage(props.pageContext.lang).name}
          prompt={<I18nString id={root.selectLang} />}
        />

      </Headbar>

      {!frontmatter.hide_heading &&
        (
          <div>
            <h1>{frontmatter.title}</h1>
            <TagGroup tags={frontmatter.tags} />
            {frontmatter.date && <p>{frontmatter.date}</p>}
          </div>
        )
      }
      <MarkdownDisplay dangerouslySetInnerHTML={{ __html: html }} />
      <hr />
      <CommentPanel
        language={language.gitalkLangId}
        articleId={frontmatter.id}
        articleTitle={frontmatter.title}
      />

    </Page>
  );
});

export const query = graphql`
  query PageTemplateQuery(
    $id: String!
    $lang: String!
  ) {
    site {
      siteMetadata {
        title
        description
        author {
          name
          url
        }
      }
    }
    markdownRemark(frontmatter: { id: { eq: $id }, lang: { eq: $lang } }) {
      html
      excerpt
      frontmatter {
        date
        id
        title
        tags
        hide_heading
        lang
      }
    }
  }
`;
