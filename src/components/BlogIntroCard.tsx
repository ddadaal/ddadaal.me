import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots } from "react-icons/fa";
import StackedDiv from "../layouts/components/StackedDiv";
import { Link } from "gatsby";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import { I18nConsumer } from "../i18n/I18nContext";
import { ArticleGroups } from "../models/ArticleGroups";
import { getNodeFromLang } from "../utils/articleGroupUtils";

interface Props {
  articleGroups: ArticleGroups;
}

const root = lang().blogIntro;

export default function BlogIntroCard(props: Props) {
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
          <I18nConsumer>
            {({ language }) => (
              <Link className="card-link" to={getNodeFromLang(language, "feedback", props.articleGroups).path!}>
                <FaRegCommentDots />
                <I18nString id={root.feedback} />
              </Link>
            )}
          </I18nConsumer>

        </StackedDiv>
      </CardBody>
    </Card>
  );
}
