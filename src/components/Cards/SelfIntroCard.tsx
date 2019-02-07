import React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile, FaGithub, FaMale, FaAddressBook } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "@/layouts/components/StackedDiv";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import CardHeader from "reactstrap/lib/CardHeader";
import Contacts from "../Contacts";
import { useStore } from "@/stores/stater";

interface Props {
}

const root = lang.selfIntro;

export default function SelfIntroCard(props: Props) {

  const articleStore = useStore(ArticleStore);
  const i18nStore = useStore(I18nStore);

  const aboutMePath = articleStore.getNodeFromLang("about-me", i18nStore.state.language).path;

  return (
    <Card className="hover-card">
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span>👦 <LocalizedString id={root.author} /></span>
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
          <Contacts color="black" size={1.4}/>
      </CardBody>
    </Card>
  );
};
