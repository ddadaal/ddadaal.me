import * as React from 'react';
import styled from 'styled-components'
import Page from '../components/Page'
import { breakpoints, widths } from '../styles/variables'
import { Row, Col } from 'reactstrap';

interface HomePageProps {
  children: React.ReactNode[];
}


const LeftContainer = styled(Col)`
  width: 70%;
  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }
`

const RightContainer = styled(Col)`
  width: 30%;
  @media (max-width: ${breakpoints.md}) {
    display: none;
    padding-left: 16px;
  }
`

const Container = styled(Page)`
  max-width: ${widths.xl}px;
  margin-left: auto;
  margin-right: auto;
`

export default function HomePageLayout(props: {children?: React.ReactNode}) {
  const left = props.children[0];
  const right = props.children[1];

  return <Container>
    <Row>
    <Col md={8} xs={12}>
      {left}
    </Col>
    <Col md={4} xs={0}>
      {right}
    </Col>
    </Row>
  </Container>
}
