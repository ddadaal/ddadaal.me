import * as React from "react";
import Helmet from "react-helmet";

import Page from "../components/Page";
import Container from "../components/Container";
import { CommentContainer } from "../components/CommentContainer";
import Link from "gatsby-link";
import TagGroup from "../components/TagGroup";
import { ArticleNode } from "../models/ArticleNode";
import { graphql } from "gatsby";
import IndexLayout from "../layouts";

interface Props {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: {
          name: string;
          url: string;
        }
      },
    }
    markdownRemark: ArticleNode,
  };
}

export default function PageTemplate(props: Props) {
  const { frontmatter, html } = props.data.markdownRemark;
  return (
  <IndexLayout>
    <Page>
      <Helmet title={`VicBlog - ${frontmatter.title}`} />
      <Container>
        <Link to={"/"}>Back To Home</Link>
        <h1>{frontmatter.title}</h1>
        <TagGroup tags={frontmatter.tags} />
        {frontmatter.date && <p>{new Date(frontmatter.date).toLocaleString()}</p>}
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <hr />
        <CommentContainer />
      </Container>
    </Page>
  </IndexLayout>
  );
}

export const query = graphql`
  query PageTemplateQuery($id_name: String!) {
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
    markdownRemark(frontmatter: { id_name: { eq: $id_name } }) {
      html
      excerpt
      frontmatter {
        date
        id_name
        title
        tags
      }
    }
  }
`;
