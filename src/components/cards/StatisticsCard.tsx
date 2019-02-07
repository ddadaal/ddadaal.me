import React from "react";
import { StatisticsStore } from "@/stores/StatisticsStore";
import lang from "@/i18n/lang";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";
import LocalizedString from "@/i18n/LocalizedString";
import ListGroupHeader from "../UI/ListGroup/ListGroupHeader";
import { useStore } from "@/stores/stater";

const root = lang.statistics;

export default () => {
  const store = useStore(StatisticsStore);

  return (
    <ListGroup flush={false} className="hover-card">
      <ListGroupHeader>
      📈 <LocalizedString id={root.title} />
      </ListGroupHeader>
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <LocalizedString id={root.articleCount} />
        <Badge pill={true} color="primary">{store.state.totalArticleCount}</Badge>
      </ListGroupItem>
      <ListGroupItem className="d-flex justify-content-between align-items-center">
        <LocalizedString id={root.lastUpdated} />
        <Badge pill={true} color="primary">
          {store.state.lastUpdated}
        </Badge>
      </ListGroupItem>
    </ListGroup>
  );
};
