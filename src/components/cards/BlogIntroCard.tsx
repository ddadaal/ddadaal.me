import React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots, FaGlobe, FaEllipsisH } from "react-icons/fa";
import StackedDiv from "@/layouts/components/StackedDiv";
import { Link } from "gatsby";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import CardHeader from "reactstrap/lib/CardHeader";
import { useStore } from "@/stores/stater";

interface Props {

}

const root = lang.blogIntro;

export default function BlogIntroCard(props: Props) {

  const articleStore = useStore(ArticleStore);
  const i18nStore = useStore(I18nStore);

  return (
    <Card className="hover-card">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>💻 VicBlog <LocalizedString id={root.subtitle} /></span>
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
};
