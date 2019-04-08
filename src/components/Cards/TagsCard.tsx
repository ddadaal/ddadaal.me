import React from "react";
import lang from "@/i18n/lang";
import { Card, CardBody, CardHeader, CardText } from "reactstrap";
import { Link } from "gatsby";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import LocalizedString from "@/i18n/LocalizedString";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import ArticleTagGroup from "@/components/Article/TagGroup";

const root = lang.tagsCard;

export default function TagsCard() {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const tags = metadataStore.getTagsOfLang(i18nStore.language);

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>🏷️ <LocalizedString id={root.title}/></span>
      </BaseCardHeader>
      <CardBody>
        <ArticleTagGroup tags={tags}/>
      </CardBody>
    </BaseCard>
  );
}
