import * as React from 'react'
import Helmet from 'react-helmet';

import Page from '../components/Page'
import Container from '../components/Container'
import { CommentContainer } from '../components/CommentContainer'
import Link from 'gatsby-link';
import If from '../components/If'
import TagGroup from '../components/TagGroup'
import { ArticleNode } from '../models/ArticleNode'

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
      }
    }
    markdownRemark: ArticleNode
  }
}

export default function PageTemplate(props: Props) {
  const {frontmatter, html} = props.data.markdownRemark;
  return <Page>
    <Helmet title={`VicBlog - ${frontmatter.title}`} />
    <Container>
      <Link to={"/"}>Back To Home</Link>
      <h1>{frontmatter.title}</h1>
      <TagGroup tags={frontmatter.tags}/>
      <If condition={frontmatter.date}>
        <p>{new Date(frontmatter.date).toLocaleString()}</p>
      </If>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <hr/>
      <CommentContainer/>
    </Container>
  </Page>
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
`
