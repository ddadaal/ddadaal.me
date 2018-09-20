import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

interface Props {

}

const Container = styled.div`
  text-align: center;
`;

export default function Footer(props: Props) {
  return <Container>
    <p>
      Coded proudly by <Link to="/about/me">VicCrubs</Link>
    </p>
    <p>
      Powered by
      <a href={"https://reactjs.org/"}> React</a>,
      <a href={"https://www.gatsbyjs.org/"}> Gatsby</a>
    </p>
    <p>
      Themed with
      <a href={"https://reactstrap.github.io/"}> Reactstrap</a>,
      <a href={"https://bootswatch.com/darkly/"}> Bootswatch Darkly</a>
    </p>
    <p>
      All Site Contents Licensed with
      <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
        &nbsp;BY CC-SA 4.0
      </a>
    </p>
    <p>
      Made with ❤
    </p>
  </Container>;
}
