import * as React from 'react'
import Helmet from 'react-helmet';

import Page from '../components/Page'
import Container from '../components/Container'
import { CommentContainer } from '../components/CommentContainer'
import Link from 'gatsby-link';
import If from '../components/If'

interface PageTemplateProps {
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
        author: {
          name: string
          url: string
        }
      }
    }
    markdownRemark: {
      html: string
      excerpt: string
      frontmatter: {
        date: string
        path: string
        title: string
      }
    }
  }
}

const PageTemplate: React.SFC<PageTemplateProps> = ({ data }) => (
  <Page>
    <Helmet title={`VicBlog - ${data.markdownRemark.frontmatter.title}`} />
    <Container>
      <Link to={"/"}>Back To Home</Link>
      <h1>{data.markdownRemark.frontmatter.title}</h1>
      <If condition={data.markdownRemark.frontmatter.date}>
        <p>on {data.markdownRemark.frontmatter.date}</p>
      </If>
      <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
    </Container>
    {/*<CommentContainer/>*/}
  </Page>
)

export default PageTemplate

export const query = graphql`
  query PageTemplateQuery($path: String!) {
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
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      excerpt
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        path
        title
      }
    }
  }
`
