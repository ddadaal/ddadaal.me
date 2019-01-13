import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile, FaGithub, FaMale } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "@/layouts/components/StackedDiv";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import CardHeader from "reactstrap/lib/CardHeader";

interface Props extends WithStoresProps {
}

const root = lang.selfIntro;

export default withStores(ArticleStore, I18nStore)(function SelfIntroCard(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span><FaMale /> <I18nString id={root.author} /></span>
        <Link
          className="card-link"
          to={articleStore.getNodeFromLang("about-me", i18nStore.state.language).path}
          title={i18nStore.language.definitions.selfIntro.more}
        >
          <I18nString id={root.moreLink} />
        </Link>
      </CardHeader>
      <CardBody>
        <CardText>
          <I18nString id={root.university} />
        </CardText>
        <CardText>
          <I18nString id={root.grade} />
        </CardText>
        <StackedDiv>
          <CardLink href="mailto://smallda@outlook.com">
            <FaEnvelope />
            <I18nString id={root.mailToMe} />
          </CardLink>
          <Link className="card-link" to={articleStore.getNodeFromLang("resume", i18nStore.state.language).path}>
            <FaFile />
            <I18nString id={root.resume} />
          </Link>
          <CardLink href="https://github.com/viccrubs">
            <FaGithub />
            GitHub
          </CardLink>

        </StackedDiv>
      </CardBody>
    </Card>
  );
});
