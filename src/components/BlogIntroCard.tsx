import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots } from "react-icons/fa";
import StackedDiv from "../layouts/components/StackedDiv";
import { Link } from "gatsby";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";

interface Props extends WithStoresProps {

}

const root = lang.blogIntro;

export default withStores(ArticleStore, I18nStore)(function BlogIntroCard(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  return (
    <Card>
      <CardBody>
        <CardTitle>VicBlog</CardTitle>
        <CardSubtitle>
          <I18nString id={root.subtitle} />
        </CardSubtitle>
      </CardBody>
      <CardBody>
        <CardText>
          <I18nString id={root.description} />
        </CardText>
        <StackedDiv>
          <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby">
            <FaCode />
            <I18nString id={root.sourceCode} />
          </CardLink>
          <CardLink href="/rss.xml">
            <FaRss />
            RSS
          </CardLink>
          <Link className="card-link" to={articleStore.getNodeFromLang("feedback", i18nStore.state.language).path!}>
            <FaRegCommentDots />
            <I18nString id={root.feedback} />
          </Link>
        </StackedDiv>
      </CardBody>
    </Card>
  );
});

