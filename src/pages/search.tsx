import * as React from "react";
import { ArticleNode } from "@/models/ArticleNode";
import ArticleItem from "@/components/Article/ArticleItem";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import Page from "@/layouts/components/Page";
import withStores from "@/stores/withStores";
import { LocationStore } from "@/stores/LocationStore";
import { ArticleStore } from "@/stores/ArticleStore";
import { Row, Col } from "reactstrap";
import { navigate } from "gatsby";
import ArticleItemList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";

const root = lang.search;

interface Query {
  query?: string;
  page?: number;
}

const pageSize = 5;

export default withStores(LocationStore, ArticleStore)(function SearchPage({ useStore }) {

  const articleStore = useStore(ArticleStore);
  const { query, page = 1 } = useStore(LocationStore).query as Query;

  const pageIndex = page - 1;

  let searchResult = Object.entries(articleStore.state.articleGroups).map((x) => x[1]);

  if (query) {
    searchResult = searchResult.filter((x) => {
      // filter according to title
      if (x.some((y) => y.frontmatter.title.toUpperCase().includes(query.toUpperCase()))) {
        return true;
      }

      // filter according to tag
      if (x.some((y) =>
        y.frontmatter.tags !== undefined
        && y.frontmatter.tags.some(
          ((tag) => tag.toUpperCase().includes(query.toUpperCase())),
        ),
      )) {
        return true;
      }

      // add more filters here
      return false;
    });
  }

  // @ts-ignore
  searchResult.sort((a, b) => new Date(b[0].frontmatter.date) - new Date(a[0].frontmatter.date));

  const totalCount = searchResult.length;

  const pageCount = Math.ceil(totalCount / pageSize);

  // pagination
  searchResult = searchResult.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <Page>
      <ArticleListLayout>
        <h3>
          <LocalizedString id={root.title} replacements={[
            <strong key={"query"}>{query}</strong>,
          ]} />
        </h3>
        <small>
          <LocalizedString id={root.info} replacements={[
            totalCount,
          ]} />
        </small>
        <hr />
        <ArticleItemList
          ids={searchResult.map((x) => x[0].frontmatter.id)}
          pageCount={pageCount}
          pageIndex={page - 1}
          toPage={(pageNum) => {
            const path = `/search?query=${encodeURIComponent(query || "")}&page=${pageNum + 1}`;
            return () => navigate(path);
          }}
        />
      </ArticleListLayout>

    </Page>
  );
});
