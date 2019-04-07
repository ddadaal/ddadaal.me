import React from "react";
import lang from "@/i18n/lang";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";
import LocalizedString from "@/i18n/LocalizedString";
import ListGroupHeader from "../UI/ListGroup/ListGroupHeader";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";

const root = lang.statistics;

export default function StatisticsCard() {
  const store = useStore(MetadataStore);

  const { statistics } = store;

  return (
    <ListGroup flush={false} className="hover-card">
      <ListGroupHeader>
      📈 <LocalizedString id={root.title} />
      </ListGroupHeader>
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <LocalizedString id={root.articleCount} />
        <Badge pill={true} color="primary">{statistics.totalArticleCount}</Badge>
      </ListGroupItem>
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <LocalizedString id={root.lastUpdated} />
        <Badge pill={true} color="primary">
          {statistics.lastUpdated}
        </Badge>
      </ListGroupItem>
    </ListGroup>
  );
}
