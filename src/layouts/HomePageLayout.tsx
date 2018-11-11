import * as React from "react";
import Page from "../components/Page";
import { Col, Row } from "reactstrap";
import Container from "../components/Container";
import IndexLayout from "./IndexLayout";

interface Props {
  children: React.ReactNode[];
  location: Location;
}

export default function HomePageLayout(props: Props) {
  const left = props.children[0];
  const right = props.children[1];

  return (
    <IndexLayout location={props.location}>
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
    </IndexLayout>
  );
}
