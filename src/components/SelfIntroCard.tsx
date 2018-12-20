import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "../layouts/components/StackedDiv";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import { I18nConsumer } from "../i18n/I18nContext";
import { getNodeFromLang } from "../utils/articleGroupUtils";
import { ArticleGroups } from "../models/ArticleGroups";

interface Props {
  articleGroups: ArticleGroups;
}

const root = lang().selfIntro;

export default function SelfIntroCard(props: Props) {
  return (
    <Card>
      <CardBody>
        <CardTitle>
          <I18nString id={root.author} />
        </CardTitle>
        <CardSubtitle>
          <I18nString id={root.name} />
        </CardSubtitle>
      </CardBody>
      <CardBody>
        <CardText>
          <I18nString id={root.brief} />
        </CardText>
        <CardText>
          <I18nString id={root.major} />
        </CardText>
        <StackedDiv>
          <I18nConsumer>
            {({ language }) =>
              <Link className="card-link" to={getNodeFromLang(language, "resume", props.articleGroups).path!}>
                <FaFile />
                <I18nString id={root.resume} />
              </Link>
            }
          </I18nConsumer>
          <CardLink href="mailto://smallda@outlook.com">
            <FaEnvelope />
            <I18nString id={root.mailToMe} />
          </CardLink>
          <I18nConsumer>
            {({ language }) =>
              <Link className="card-link" to={getNodeFromLang(language, "about-me", props.articleGroups).path!}>
                <FaEllipsisH />
                <I18nString id={root.more} />
              </Link>
            }
          </I18nConsumer>
        </StackedDiv>
      </CardBody>
    </Card>
  );
}
