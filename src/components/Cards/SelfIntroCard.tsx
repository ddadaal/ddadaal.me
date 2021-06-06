import React from "react";
import { CardBody, CardText } from "reactstrap";
import { Link } from "gatsby";
import { Localized, p, useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";
import Contacts from "../Contacts";
import { useStore } from "simstate";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";

interface Props {
}

const prefix = p("selfIntro.");

const SelfIntroCard: React.FC<Props> = () => {

  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const aboutMePath = metadataStore
    .getArticleOfLang("about-me", i18n.currentLanguage.id)
    .path;

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>👦 <Localized id={prefix("author")} /></span>
        <Link
          className="card-link"
          to={aboutMePath}
          title={i18n.translate(prefix("more")) as string}
        >
          <Localized id={prefix("moreLink")} />
        </Link>
      </BaseCardHeader>
      <CardBody>
        <CardText>
          <Localized id={prefix("university")} />
        </CardText>
        <Contacts color="black" size={1.4}/>
      </CardBody>
    </BaseCard>
  );
};

export default SelfIntroCard;
