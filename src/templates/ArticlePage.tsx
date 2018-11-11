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
          <div dangerouslySetInnerHTML={{ __html: html }}/>
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
