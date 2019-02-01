import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots, FaGlobe, FaEllipsisH } from "react-icons/fa";
import StackedDiv from "@/layouts/components/StackedDiv";
import { Link } from "gatsby";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import CardHeader from "reactstrap/lib/CardHeader";
import { StatisticsStore } from "@/stores/StatisticsStore";


interface Props extends WithStoresProps {

}

const root = lang.blogIntro;

export default withStores(ArticleStore, I18nStore)(function BlogIntroCard(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span><FaGlobe /> VicBlog <LocalizedString id={root.subtitle} /></span>
        <Link
          className="card-link"
          to={articleStore.getNodeFromLang("about-project", i18nStore.state.language).path}
          title={i18nStore.language.definitions.blogIntro.more}
        >
          <LocalizedString id={root.moreLink} />
        </Link>
      </CardHeader>
      <CardBody>
        <CardText>
          <LocalizedString id={root.description1} />
        </CardText>
        <CardText>
          <LocalizedString id={root.description2} />
        </CardText>
        <StackedDiv>
          <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby">
            <FaCode />
            <LocalizedString id={root.sourceCode} />
          </CardLink>
          <CardLink href="/rss.xml">
            <FaRss />
            RSS
          </CardLink>
          <Link
            className="card-link"
            to={articleStore.getNodeFromLang("feedback", i18nStore.state.language).path}
          >
            <FaRegCommentDots />
            <LocalizedString id={root.feedback} />
          </Link>
        </StackedDiv>
      </CardBody>
    </Card>
  );
});

