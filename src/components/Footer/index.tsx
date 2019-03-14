import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import { colors, widths } from "@/styles/variables";
import { Row, Col } from "reactstrap";
import Contacts from "../Contacts";
import { useStore } from "simstate";
import friendLinks from "@/configs/friendLinks";
import Brief from "@/components/Footer/Brief";
import List from "@/components/Footer/List";
import MadeWithLove from "@/components/Footer/MadeWithLove";

interface Props {
  className?: string;
}

const Container = styled.footer`
  /* text-align: center; */

  color: white;
  background-color: ${colors.headerBg};

  padding: 32px 0px;

  hr {
    color: white;
  }

  .footer-contents {
    max-width: ${widths.mainContent}px;
    margin-left: auto;
    margin-right: auto;
  }

`;

const powerBys = [
  ["React", "https://reactjs.org/"],
  ["Gatsby", "https://www.gatsbyjs.org/"],
  ["GitHub Pages", "https://pages.github.com/"],
  ["TypeScript", "https://www.typescriptlang.org/"],
].map(([name, link]) => ({ name, link }));

const themedWiths = [
  ["reactstrap", "https://reactstrap.github.io/"],
  ["Bootswatch Flatly", "https://bootswatch.com/flatly/"],
  ["styled-components", "https://www.styled-components.com/"],
  ["SASS", "https://sass-lang.com/"],
].map(([name, link]) => ({ name, link }));

const friends = friendLinks.map(({ name, link, description }) => ({
  name: `${name} - ${description}`,
  link,
}));

const root = lang.footer;

export default function Footer(props: Props) {

  return (
    <Container className={props.className}>
      <Row className="footer-contents">
        <Col xs={{ size: 12, order: 1 }} md={{ size: 5, order: 1 }}>
          <Brief />
        </Col>
        <Col className={"d-sm-none d-md-block"} md={{ size: 2, order: 2 }}>
          <h6>🚀 <LocalizedString id={root.poweredBy} /></h6>
          <List links={powerBys} />
        </Col>
        <Col className={"d-sm-none d-md-block"} md={{ size: 2, order: 3 }}>
          <h6>🎨 <LocalizedString id={root.themedWith} /></h6>
          <List links={themedWiths} />
        </Col>
        <Col xs={{ size: 12, order: 2 }} md={{ size: 3, order: 4 }}>
          <h6>👨‍🎓 <LocalizedString id={root.friends} /></h6>
          <List links={friends} />
        </Col>
      </Row>
      <hr />
      <MadeWithLove />
    </Container>
  );
}
