import React from "react";
import { CardBody, CardText } from "reactstrap";
import { Link } from "gatsby";
import { Localized, prefix, useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";
import Contacts from "../Contacts";
import { useStore } from "simstate";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";

interface Props {
}

const p = prefix("selfIntro.");

const SelfIntroCard: React.FC<Props> = () => {

  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const aboutMePath = metadataStore
    .getArticleOfLang("about-me", i18n.currentLanguage.id)
    .path;

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>👦 <Localized id={p("author")} /></span>
        <Link
          className="card-link"
          to={aboutMePath}
          title={i18n.translate(p("more")) as string}
        >
          <Localized id={p("moreLink")} />
        </Link>
      </BaseCardHeader>
      <CardBody>
        <CardText>
          <Localized id={p("university")} />
        </CardText>
        <Contacts color="black" size={1.4}/>
      </CardBody>
    </BaseCard>
  );
};

export default SelfIntroCard;
