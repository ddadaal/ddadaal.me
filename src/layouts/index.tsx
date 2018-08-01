import * as React from 'react'
import Helmet from 'react-helmet'

import "prismjs/themes/prism-okaidia.css";
import "../styles/bootstrap.css"

import Header from '../components/Header'
import LayoutRoot from '../components/LayoutRoot'
import LayoutMain from '../components/LayoutMain'
import Footer from '../components/Footer'

interface WrapperProps {
  children: () => any
  data: {
    site: {
      siteMetadata: {
        title: string
        description: string
      }
    }
  }
}

const IndexLayout: React.SFC<WrapperProps> = ({ children, data }) => (
  <LayoutRoot>
    <Helmet
      title={data.site.siteMetadata.title}
      meta={[
        { name: 'description', content: data.site.siteMetadata.description },
        { name: 'keywords', content: 'gatsbyjs, gatsby, javascript, sample, something' }
      ]}
    />
    <Header title={data.site.siteMetadata.title} />
    <LayoutMain>{children()}</LayoutMain>
    <Footer/>
  </LayoutRoot>
)

export default IndexLayout

export const query = graphql`
  query IndexLayoutQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
