import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile, FaGithub, FaMale, FaAddressBook } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "@/layouts/components/StackedDiv";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import CardHeader from "reactstrap/lib/CardHeader";
import Contacts from "../Footer/Contacts";

interface Props extends WithStoresProps {
}

const root = lang.selfIntro;

export default withStores(ArticleStore, I18nStore)(function SelfIntroCard(props: Props) {

  const articleStore = props.useStore(ArticleStore);
  const i18nStore = props.useStore(I18nStore);

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.state.language).path;

  return (
    <Card className="hover-card">
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
          <Contacts color="dark" size={1.4}/>
        </CardText>
      </CardBody>
    </Card>
  );
});
