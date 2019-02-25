import React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import { colors, widths } from "@/styles/variables";
import { Row, Col } from "reactstrap";
import Contacts from "../Contacts";
import { useStore } from "simstate";

interface Props {
  className?: string;
}

const friendLinks = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
];

const Container = styled.footer`
  /* text-align: center; */

  color: white;
  background-color: ${colors.headerBg};

  padding: 32px 0px;

  hr {
    color: white;
  }

  ul {
    list-style: none;
    padding-left: 0px;

    &>li {
      padding-bottom: 4px;
    }
  }

  .footer-bottom {
    text-align: center;
  }

  .footer-brief {

  }

  .footer-contents {
    max-width: ${widths.mainContent}px;
    margin-left: auto;
    margin-right: auto;
  }

`;

const root = lang.footer;

export default function Footer(props: Props) {

  const articleStore = useStore(ArticleStore);
  const i18nStore = useStore(I18nStore);

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.language).path;

  return (
    <Container className={props.className}>
      <Row className="footer-contents">
        <Col xs={12} md={5}>
          <div className="footer-brief">

            <p>
              👨🏼‍💻 <LocalizedString id={root.codeBy} replacements={[
                <Link key={"me"} to={aboutMePath}>VicCrubs</Link>,
              ]} />
            </p>
            <p>
              📝 <LocalizedString id={root.license} replacements={[
                <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
                  BY CC-SA 4.0
                </a>,
              ]} />

            </p>
            <div>
              <span id="contacts">📲 <LocalizedString id={root.contacts}/></span>
              <Contacts color="white" size={1.6}/>
            </div>
          </div>
        </Col>
        <Col xs={12} md={2}>
          <h6>🚀 <LocalizedString id={root.poweredBy} /></h6>
          <ul>
            <li>
              <a key="React" href={"https://reactjs.org/"}>React</a>
            </li>
            <li>
              <a key="Gatsby" href={"https://www.gatsbyjs.org/"}>Gatsby</a>
            </li>
            <li>
              <a key="Pages" href={"https://pages.github.com/"}>GitHub Pages</a>
            </li>
            <li>
              <a key="TypeScript" href={"https://www.typescriptlang.org/"}>TypeScript</a>
            </li>
          </ul>
        </Col>
        <Col xs={12} md={2}>
          <h6>🎨 <LocalizedString id={root.themedWith} /></h6>
          <ul>
            <li>
              <a key="reactstrap" href={"https://reactstrap.github.io/"}>Reactstrap</a>
            </li>
            <li>
              <a key="theme" href={"https://bootswatch.com/flatly/"}>Bootswatch Flatly</a>
            </li>
            <li>
              <a key="styled-components" href={"https://www.styled-components.com/"}>styled-components</a>
            </li>

            <li>
              <a key="sass" href={"https://sass-lang.com/"}>SASS</a>
            </li>
          </ul>
        </Col>
        <Col xs={12} md={3}>
          <h6>👨‍🎓 <LocalizedString id={root.friends} /></h6>
          <ul>
          {friendLinks.map((link) => (
              <li key={link.name}>
                <a href={link.link}>
                  {`${link.name} - ${link.description}`}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
      <hr/>
      <p className="footer-bottom">
        © {new Date().getFullYear()} | <LocalizedString id={root.madeWithLove} />
      </p>
    </Container>
  );
}
