import React from "react";

import { navigate } from "gatsby";
import ArticleList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";
import { languageIds, useI18nStore } from "@/i18n";
import { lang } from "@/i18n";
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
  const { currentLanguage } = useI18nStore();

  return (
    <ArticleListLayout>
      <PageMetadata
        titleId={root.articleList}
        meta={Object.keys(languageIds)
          .filter((x) => x !== currentLanguage.id)
          .map((x) => ({
            name: "og:locale:alternate",
            content: languageIds[x],
          }))}
      />
      <ArticleList ids={ids} pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
    </ArticleListLayout>
  );
};

export default ArticleListPageTemplate;
