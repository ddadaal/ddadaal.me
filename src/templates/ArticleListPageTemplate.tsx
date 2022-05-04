import { navigate } from "gatsby";
import React from "react";

import ArticleList from "@/components/Article/ArticleItemList";
import { PageMetadata } from "@/components/PageMetadata";
import { languageInfo, prefix, useI18n } from "@/i18n";
import ArticleListLayout from "@/layouts/ArticleListLayout";

const root = prefix("pageMedatadata.");

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
  const { currentLanguage } = useI18n();

  return (
    <ArticleListLayout>
      <PageMetadata
        titleId={root("articleList")}
        meta={Object.keys(languageInfo)
          .filter((x) => x !== currentLanguage.id)
          .map((x) => ({
            name: "og:locale:alternate",
            content: languageInfo[x].detailedId,
          }))}
      />
      <ArticleList
        ids={ids}
        pageCount={pageCount}
        pageIndex={pageIndex}
        toPage={toPage}
      />
    </ArticleListLayout>
  );
};

export default ArticleListPageTemplate;
