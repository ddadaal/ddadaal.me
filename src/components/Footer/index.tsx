import React from "react";
import { Col,Row } from "reactstrap";
import styled from "styled-components";

import Brief from "@/components/Footer/Brief";
import List from "@/components/Footer/List";
import MadeWithLove from "@/components/Footer/MadeWithLove";
import { Localized, prefix } from "@/i18n";
import { colors, widths } from "@/styles/variables";

interface Props {
  className?: string;
}

const Container = styled.footer`
  /* text-align: center; */

  color: white;
  background-color: ${colors.headerBg};

  padding: 32px 0;

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
  ["Coding.NET Pages", "https://coding.net"],
  ["TypeScript", "https://www.typescriptlang.org/"],
].map(([name, link]) => ({ name, link }));

const themedWiths = [
  ["reactstrap", "https://reactstrap.github.io/"],
  ["Bootswatch Flatly", "https://bootswatch.com/flatly/"],
  ["styled-components", "https://www.styled-components.com/"],
  ["SASS", "https://sass-lang.com/"],
].map(([name, link]) => ({ name, link }));


const friends = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
  { name: "Sephidator", description: "Sephidator的个人博客", link: "https://sephidator.xyz" },
  { name: "iznauy", description: "个人博客", link: "https://iznauy.github.io/" },
  { name: "Aironoria", description: "陈俊宇的个人博客", link: "https://aironoria.github.io" },
  { name: "forewing", description: "个人主页", link: "https://jbesu.com/" },
  { name: "Weizer", description: "个人主页", link: "https://weiser.fun" },
].map(({ name, link, description }) => ({
  name: `${name} - ${description}`,
  link,
}));

const root = prefix("footer.");

const Footer: React.FC<Props> = (props) => {
  return (
    <Container className={props.className}>
      <Row className="footer-contents">
        <Col md={{ size: 4 }}>
          <Brief/>
        </Col>
        <Col className={"d-none d-sm-none d-md-block"} md={{ size: 2 }}>
          <h6>🚀 <Localized id={root("poweredBy")}/></h6>
          <List links={powerBys}/>
        </Col>
        <Col className={"d-none d-sm-none d-md-block"} md={{ size: 2 }}>
          <h6>🎨 <Localized id={root("themedWith")}/></h6>
          <List links={themedWiths}/>
        </Col>
        <Col md={{ size: 4 }}>
          <h6>👨‍🎓 <Localized id="friends.title" /></h6>
          <List links={friends}/>
        </Col>
      </Row>
      <hr/>
      <MadeWithLove/>
    </Container>
  );
};

export default Footer;
