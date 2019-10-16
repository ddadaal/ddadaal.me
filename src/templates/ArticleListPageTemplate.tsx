import React from "react";

import I18nStore from "@/stores/I18nStore";
import { navigate } from "gatsby";
import ArticleList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import { useStore } from "simstate";
import { allLanguages } from "@/i18n/definition";
import lang from "@/i18n/lang";
import { PageMetadata } from "@/components/PageMetadata";

const root = lang.pageMedatadata;

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

  return (
    <ArticleListLayout>
      <PageMetadata
        titleId={root.articleList}
        meta={allLanguages
          .filter((x) => x !== language)
          .map((x) => ({
            name: "og:locale:alternate",
            content: x.metadata.detailedId,
          }))}
      />
      <ArticleList ids={ids} pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
    </ArticleListLayout>
  );
}

export default ArticleListPageTemplate;
