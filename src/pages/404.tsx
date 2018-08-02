import * as React from 'react'
import Link from 'gatsby-link'

import Page from '../components/Page'
import Container from '../components/Container'

const NotFoundPage = () => (
  <Page>
    <Container>
      <h1>404: Page not found.</h1>
      <p>
        You've entered the void!
      </p>
      <p>
        <Link to="/" href="/">
          Go home now.
        </Link>
      </p>
    </Container>
  </Page>
)

export default NotFoundPage
