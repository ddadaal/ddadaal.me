import { navigate } from "gatsby";
import React from "react";
import { useStore } from "simstate";

import ArticleItemList from "@/components/Article/ArticleItemList";
import { PageMetadata } from "@/components/PageMetadata";
import { Localized, prefix, useI18n } from "@/i18n";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import LocationStore from "@/stores/LocationStore";
import MetadataStore from "@/stores/MetadataStore";

const root = prefix("search.");

interface Query {
  query?: string;
  page?: number;
}

const pageSize = 5;

const SearchPage: React.FC = () => {

  const locationStore = useStore(LocationStore);
  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const { query, page = 1 } = locationStore.query as Query;

  const pageIndex = page - 1;

  let searchResult = Array.from(metadataStore.articleIdMap.values());

  if (query) {
    searchResult = searchResult.filter((articles) => {
      // filter according to title
      if (articles.some((article) =>
        article.frontmatter.title.toUpperCase().includes(query.toUpperCase()))) {
        return true;
      }

      // filter according to tag
      if (articles.some((article) =>
        article.frontmatter.tags !== null // article has tags
        && article.frontmatter.tags.some(((tag) => // one of the tag satisfies:
          metadataStore.getAllVariationsOfTag(tag).some((existingTag) =>
            existingTag.toUpperCase().includes(query.toUpperCase()),
          )
        )),
      )) {
        return true;
      }

      // add more filters here
      return false;
    });
  }

  searchResult.sort((a, b) =>
    new Date(b[0].frontmatter.date).getTime() -
     new Date(a[0].frontmatter.date).getTime());

  const totalCount = searchResult.length;

  const pageCount = Math.ceil(totalCount / pageSize);

  // pagination
  searchResult = searchResult.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize,
  );

  return (
    <ArticleListLayout>
      <PageMetadata
        title={i18n.translate(root("title"), [query]) as string}
      />
      <h3>
        <Localized id={root("title")} args={[
          <strong key={"query"}>{query}</strong>,
        ]}
        />
      </h3>
      <small>
        <Localized id={root("info")} args={[
          totalCount,
        ]}
        />
      </small>
      <hr />
      <ArticleItemList
        ids={searchResult.map((x) => x[0].frontmatter.id)}
        pageCount={pageCount}
        pageIndex={page - 1}
        toPage={(pageNum) => {
          const queryEncoded = encodeURIComponent(query || "");
          const querystring = `query=${queryEncoded}&page=${pageNum + 1}`;
          const path = `/articles/search?${querystring}`;
          return () => navigate(path);
        }}
      />
    </ArticleListLayout>
  );
};

export default SearchPage;
