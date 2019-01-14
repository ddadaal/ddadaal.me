import * as React from "react";
import { ArticleNode } from "@/models/ArticleNode";
import ArticleItem from "@/components/Article/ArticleItem";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import Page from "@/layouts/components/Page";
import withStores from "@/stores/withStores";
import { LocationStore } from "@/stores/LocationStore";
import { ArticleStore } from "@/stores/ArticleStore";

const root = lang.search;

interface Query {
  search?: string;
}

export default withStores(LocationStore, ArticleStore)(function SearchPage({ useStore }) {

  const articleStore = useStore(ArticleStore);
  const { search } = useStore(LocationStore).query as Query;

  let searchResult = articleStore.state.articleGroups;

  return (
    <Page>
      Under construction
    </Page>

  );
});
