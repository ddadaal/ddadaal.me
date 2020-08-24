import React from "react";
import { CardBody, CardText } from "reactstrap";
import { Link } from "gatsby";
import { LocalizedString } from "simstate-i18n";
import { lang, useI18nStore } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";
import Contacts from "../Contacts";
import { useStore } from "simstate";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";

interface Props {
}

const root = lang.selfIntro;

const SelfIntroCard: React.FC<Props> = () => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useI18nStore();

  const aboutMePath = metadataStore.getArticleOfLang("about-me", i18nStore.currentLanguage.id).path;

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>👦 <LocalizedString id={root.author} /></span>
        <Link
          className="card-link"
          to={aboutMePath}
          title={i18nStore.currentLanguage.definitions.selfIntro.more}
        >
          <LocalizedString id={root.moreLink} />
        </Link>
      </BaseCardHeader>
      <CardBody>
        <CardText>
          <LocalizedString id={root.university} />
        </CardText>
        <Contacts color="black" size={1.4}/>
      </CardBody>
    </BaseCard>
  );
}

export default SelfIntroCard;
