import React from "react";
import lang from "@/i18n/lang";
import { Card, CardBody, CardHeader, CardText } from "reactstrap";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import LocalizedString from "@/i18n/LocalizedString";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import CountedArticleTag from "@/components/Article/TagGroup/CountedArticleTag";

interface Props {
  className?: string;
}

const root = lang.tagsCard;

export default function TagsCard(props: Props) {

  const metadataStore = useStore(MetadataStore);

  const tags = Array.from(metadataStore.tagMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map((entry) => entry[0]);

  return (
    <BaseCard className={props.className}>
      <BaseCardHeader>
        <span>🏷️ <LocalizedString id={root.title}/></span>
      </BaseCardHeader>
      <CardBody>
        {tags.map((tag) => (
          <CountedArticleTag key={tag} tag={tag}/>
        ))}
      </CardBody>
    </BaseCard>
  );
}
