import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import Page from "@/layouts/Page";
import { LocationStore } from "@/stores/LocationStore";
import { MetadataStore } from "@/stores/MetadataStore";
import { navigate } from "gatsby";
import ArticleItemList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import { useStore } from "simstate";

const root = lang.search;

interface Query {
  query?: string;
  page?: number;
}

const pageSize = 5;

export default function SearchPage() {

  const locationStore = useStore(LocationStore);
  const metadataStore = useStore(MetadataStore);

  const {query, page = 1} = locationStore.query as Query;

  const pageIndex = page - 1;

  let searchResult = Array.from(metadataStore.articleIdMap.values());

  if (query) {
    searchResult = searchResult.filter((articles) => {
      // filter according to title
      if (articles.some((article) => article.frontmatter.title.toUpperCase().includes(query.toUpperCase()))) {
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

  searchResult.sort((a, b) => new Date(b[0].frontmatter.date).getTime() - new Date(a[0].frontmatter.date).getTime());

  const totalCount = searchResult.length;

  const pageCount = Math.ceil(totalCount / pageSize);

  // pagination
  searchResult = searchResult.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);

  return (
    <ArticleListLayout>
      <h3>
        <LocalizedString id={root.title} replacements={[
          <strong key={"query"}>{query}</strong>,
        ]}/>
      </h3>
      <small>
        <LocalizedString id={root.info} replacements={[
          totalCount,
        ]}/>
      </small>
      <hr/>
      <ArticleItemList
        ids={searchResult.map((x) => x[0].frontmatter.id)}
        pageCount={pageCount}
        pageIndex={page - 1}
        toPage={(pageNum) => {
          const path = `/articles/search?query=${encodeURIComponent(query || "")}&page=${pageNum + 1}`;
          return () => navigate(path);
        }}
      />
    </ArticleListLayout>
  );
}
