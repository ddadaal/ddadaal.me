import React from "react";
import lang from "@/i18n/lang";
import { Card, CardBody, CardHeader, CardText } from "reactstrap";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import LocalizedString from "@/i18n/LocalizedString";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import ArticleTag from "@/components/Article/TagGroup/ArticleTag";

const root = lang.tagsCard;

export default function TagsCard() {

  const metadataStore = useStore(MetadataStore);

  const tags = Array.from(metadataStore.tagMap.keys());

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>🏷️ <LocalizedString id={root.title}/></span>
      </BaseCardHeader>
      <CardBody>
        {tags.map((tag) => (
          <ArticleTag key={tag} tag={tag} containsCount={true} />
        ))}
      </CardBody>
    </BaseCard>
  );
}
