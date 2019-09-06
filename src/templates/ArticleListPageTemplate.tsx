import React from "react";

import I18nStore from "@/stores/I18nStore";
import MetadataStore from "@/stores/MetadataStore";
import Helmet from "react-helmet";
import { navigate } from "gatsby";
import ArticleList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import { useStore } from "simstate";
import { allLanguages } from "@/i18n/definition";

interface Props {
  pageContext: {
    pageIndex: number;
    pageCount: number;
    ids: string[];
  };
}

function toPage(pageNum: number): () => void {
  const path = `/articles${pageNum === 0 ? "" : `/${pageNum + 1}`}`;

  return () => navigate(path);
}

const ArticleListPageTemplate: React.FC<Props> = ({ pageContext }) => {
  const { pageCount, pageIndex, ids } = pageContext;
  const { language } = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  return (
    <ArticleListLayout>
      <Helmet
        title={`${language.definitions.articlePage.title} - VicBlog`}
        meta={[
          { name: "og:title", content: `${language.definitions.articlePage.title} - VicBlog` },
          { name: "og:url", content: metadataStore.baseUrl },
          { name: "og:site_name", content: "VicBlog" },
          { name: "og:locale", content: language.detailedId },
          ...allLanguages
            .filter((x) => x !== language)
            .map((x) => ({
              name: "og:locale:alternate",
              content: x.detailedId,
            })),
        ]} />
      <ArticleList ids={ids} pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
    </ArticleListLayout>
  );
}

export default ArticleListPageTemplate;
