import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";

interface Props extends WithStoresProps {
  className?: string;
}

const Container = styled.div`
  text-align: center;
`;

const root = lang.footer;

export default withStores(ArticleStore, I18nStore)(function Footer(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.language).path;

  return (
    <Container className={props.className}>
      <p>
        <I18nString id={root.codeBy} replacements={[
          <Link key={"me"} to={aboutMePath}>VicCrubs</Link>,
        ]} />
      </p>
      <p>
        <I18nString id={root.poweredBy} replacements={[
          <a key="React" href={"https://reactjs.org/"}> React</a>,
          <a key="Gatsby" href={"https://www.gatsbyjs.org/"}> Gatsby</a>,
          <a key="Pages" href={"https://pages.github.com/"}> GitHub Pages</a>,
        ]} />

      </p>
      <p>
        <I18nString id={root.themedWith} replacements={[
          <a key="reactstrap" href={"https://reactstrap.github.io/"}> Reactstrap</a>,
          <a key="theme" href={"https://bootswatch.com/flatly/"}> Bootswatch Flatly</a>,
        ]} />
      </p>
      <p>
        <I18nString id={root.license} replacements={[
          <a key="license" rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
            &nbsp;BY CC-SA 4.0
          </a>,
        ]} />

      </p>
      <p>
        <I18nString id={root.madeWithLove} />
      </p>
    </Container>
  );
});
