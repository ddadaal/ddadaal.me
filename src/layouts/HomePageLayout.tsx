import * as React from "react";
import styled from "styled-components";
import Page from "../components/Page";
import { breakpoints, widths } from "../styles/variables";
import { Row, Col } from "reactstrap";
import Container from "../components/Container";
import IndexLayout from ".";

interface Props {
  children: React.ReactNode[];
}

export default function HomePageLayout(props: Props) {
  const left = props.children[0];
  const right = props.children[1];

  return <IndexLayout>
    <Page>
    <Container>
    <Row>
    <Col md={8} xs={12}>
      {left}
    </Col>
    <Col md={4} xs={0}>
      {right}
    </Col>
    </Row>
  </Container>
  </Page>
  </IndexLayout>;
}
