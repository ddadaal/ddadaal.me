import * as React from "react";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import Page from "@/layouts/components/Page";
import Helmet from "react-helmet";
import { navigate } from "gatsby";
import ArticleList from "@/components/Article/ArticleItemList";
import ArticleListLayout from "@/layouts/ArticleListLayout";


interface Props extends WithStoresProps {
  pageContext: {
    pageIndex: number;
    pageCount: number;
    ids: string[];
  };
}



function toPage(pageNum: number) {
  const path = "/" + (pageNum === 0 ? "" : pageNum + 1);
  return () => navigate(path);
}

export default withStores(I18nStore, ArticleStore)(function Index(props: Props) {
  const { pageCount, pageIndex, ids } = props.pageContext;
  const { language, allLanguages } = props.useStore(I18nStore);
  const articleStore = props.useStore(ArticleStore);

  const items = ids.map((id) => {
    return articleStore.state.articleGroups[id];
  });

  return (
    <Page>
      <Helmet meta={[
        { name: "og:title", content: "VicBlog" },
        { name: "og:url", content: articleStore.state.baseUrl },
        { name: "og:site_name", content: "VicBlog" },
        { name: "og:locale", content: language.detailedId },
        ...allLanguages
          .filter((x) => x !== language)
          .map((x) => ({
            name: "og:locale:alternate",
            content: x.detailedId
          }))
      ]} />
      <ArticleListLayout>
        <ArticleList ids={ids} pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
      </ArticleListLayout>
    </Page>
  );
});
