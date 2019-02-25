import React from "react";

import { I18nStore } from "@/stores/I18nStore";
import { MetadataStore } from "@/stores/MetadataStore";
import Page from "@/layouts/components/Page";
import Helmet from "react-helmet";
import { navigate } from "gatsby";
import ArticleList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import { useStore } from "simstate";

interface Props {
  pageContext: {
    pageIndex: number;
    pageCount: number;
    ids: string[];
  };
}

function toPage(pageNum: number) {
  const path = pageNum === 0 ? "/" : `/articles/${pageNum + 1}`;
  return () => navigate(path);
}

export default function Index({ pageContext }: Props) {
  const { pageCount, pageIndex, ids } = pageContext;
  const { language, allLanguages } = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  return (
    <Page>
      <Helmet meta={[
        { name: "og:title", content: "VicBlog" },
        { name: "og:url", content: metadataStore.state.baseUrl },
        { name: "og:site_name", content: "VicBlog" },
        { name: "og:locale", content: language.detailedId },
        ...allLanguages
          .filter((x) => x !== language)
          .map((x) => ({
            name: "og:locale:alternate",
            content: x.detailedId,
          })),
      ]} />
      <ArticleListLayout>
        <ArticleList ids={ids} pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
      </ArticleListLayout>
    </Page>
  );
}
