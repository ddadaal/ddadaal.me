import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile, FaGithub, FaMale } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "@/layouts/components/StackedDiv";
import LocalizedString from "@/i18n/LocalizedString";
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

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.state.language).path;

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span><FaMale /> <LocalizedString id={root.author} /></span>
        <Link
          className="card-link"
          to={aboutMePath}
          title={i18nStore.language.definitions.selfIntro.more}
        >
          <LocalizedString id={root.moreLink} />
        </Link>
      </CardHeader>
      <CardBody>
        <CardText>
          <LocalizedString id={root.university} />
        </CardText>
        <CardText>
          <LocalizedString id={root.grade} />
        </CardText>
        <StackedDiv>
        <Link className="card-link" to={articleStore.getNodeFromLang("resume", i18nStore.state.language).path}>
            <FaFile />
            <LocalizedString id={root.resume} />
          </Link>
          <CardLink href="mailto://smallda@outlook.com">
            <FaEnvelope />
            <LocalizedString id={root.mailToMe} />
          </CardLink>
          <CardLink href="https://github.com/viccrubs">
            <FaGithub />
            GitHub
          </CardLink>
        </StackedDiv>
      </CardBody>
    </Card>
  );
});
