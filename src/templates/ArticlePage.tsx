import * as React from "react";
import Helmet from "react-helmet";

import Page from "../components/Page";
import Container from "../components/Container";
import CommentPanel from "../components/CommentPanel";
import TagGroup from "../components/TagGroup";
import { ArticleNode } from "../models/ArticleNode";
import { graphql, Link } from "gatsby";
import IndexLayout from "../layouts/IndexLayout";
import { FaBackward } from "react-icons/fa";
import styled from "styled-components";

const MarkdownDisplay = styled.div`

  h1, h2, h3, h4, h5, h6 {
    margin: 8px 0;
    padding-bottom: 0.3em;
        border-bottom-width: 1px;
        border-bottom-style: solid;
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
  location: Location;
}

export default function PageTemplate(props: Props) {
  const { frontmatter, html } = props.data.markdownRemark;
  return (
    <IndexLayout location={props.location}>
      <Page>
        <Helmet title={`${frontmatter.title} - VicBlog`}/>
        <Container>
          <Link to={"/"}><FaBackward/> Back To Home</Link>
          {!frontmatter.hide_heading &&
            (
              <div>
                <h1>{frontmatter.title}</h1>
                <TagGroup tags={frontmatter.tags}/>
                {frontmatter.date && <p>{new Date(frontmatter.date).toLocaleString()}</p>}
              </div>
            )
          }
          <MarkdownDisplay dangerouslySetInnerHTML={{ __html: html }}/>
          <hr/>
          <CommentPanel articleId={frontmatter.id_name} articleTitle={frontmatter.title}/>
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
        hide_heading
      }
    }
  }
`;
