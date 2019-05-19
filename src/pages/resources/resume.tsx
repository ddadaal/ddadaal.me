import React from "react";
import { graphql, useStaticQuery } from "gatsby";
import { ArticleNode, Heading } from "@/models/ArticleNode";
import ResourcePageLayout from "@/layouts/resources/ResourcePageLayout";
import ArticleContentDisplay from "@/components/Article/ContentDisplay";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { HtmlAst } from "@/models/HtmlAst";
import { matchLangWithCurrentLanguage } from "@/stores/MetadataStore";
import styled from "styled-components";

interface Props {
  data: {
    allMarkdownRemark: {
      nodes: (ArticleNode & { htmlAst: HtmlAst; headings: Heading[]; })[];
    };
  };
}

export default function ResumePage({ data: { allMarkdownRemark: { nodes } } }: Props) {

  const i18nStore = useStore(I18nStore);

  const localizedArticle = nodes.find((article) =>
    matchLangWithCurrentLanguage(article.frontmatter.lang, i18nStore.language))!!;

  return (
    <ResourcePageLayout>
      <Resume>
        <ArticleContentDisplay
          htmlAst={localizedArticle.htmlAst}
          headings={localizedArticle.headings}
        />
      </Resume>
    </ResourcePageLayout>
  );
}

const Resume = styled.div`

  && {
    line-height: 26px;

    body {
      line-height: 18px;
    }

    h1, h2, h3 {
      line-height: 18px;

    }
    h1 {
      font-size: 20px;
      margin: 12px 0;
    }
    h2 {
      font-size: 16px;
      margin: 4px 0;
    }
    h2 .highlight {
      font-weight: 700;
      font-size: 18px;
    }

    h3{
      line-height: 16px;
      font-size: 14px;
      margin: 1px 0;
    }
    ul {
      margin: 0px;
    }
    p {
      margin: 0px;
    }
    .right { float: right}
    .contact {
      margin: 20px 0;
      text-align: center;
    }
    .name {
      font-size: 36px;
      border-bottom: none;
      padding: 0;
      margin: 20px 0px;
      text-align: center;
    }
  }


`;

export const query = graphql`
  query ResumeQuery {
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      filter: { frontmatter: { id: { eq: "resume" } } }
    ) {
      nodes {
        frontmatter {
          id
          lang
          ignored
          date
          absolute_path
          related
        }
        htmlAst
        headings {
          depth
          value
        }
      }
    }
  }
`;
