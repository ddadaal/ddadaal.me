import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import { colors, widths } from "@/styles/variables";
import { Row, Col } from "reactstrap";

interface Props extends WithStoresProps {
  className?: string;
}

const friendLinks = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
];

const Container = styled.footer`
  /* text-align: center; */

  color: white;
  background-color: ${colors.headerBg};

  padding: 32px;

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

export default withStores(ArticleStore, I18nStore)(function Footer(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.language).path;

  return (
    <Container className={props.className}>
      <Row className="footer-contents">
        <Col xs={12} md={3}>
          <div className="footer-brief">

            <p>
              👦 <I18nString id={root.codeBy} replacements={[
                <Link key={"me"} to={aboutMePath}>VicCrubs</Link>,
              ]} />
            </p>
            <p>
              📝 <I18nString id={root.license} replacements={[
                <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
                  BY CC-SA 4.0
                </a>,
              ]} />

            </p>
          </div>
        </Col>
        <Col xs={12} md={3}>
          <h6>🚀 <I18nString id={root.poweredBy} /></h6>
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
          </ul>
        </Col>
        <Col xs={12} md={3}>
          <h6>🎨 <I18nString id={root.themedWith} /></h6>
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
          <h6>👨‍🎓 <I18nString id={root.friends} /></h6>
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
        © {new Date().getFullYear()} | <I18nString id={root.madeWithLove} />
      </p>
    </Container>
  );
});
