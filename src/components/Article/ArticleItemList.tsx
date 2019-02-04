import * as React from "react";
import { ArticleStore } from "@/stores/ArticleStore";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import ArticleItem from "./ArticleItem";
import PageIndicator from "../PageIndicator";

interface Props extends WithStoresProps {
  ids: string[];
  pageCount: number;
  pageIndex: number;
  toPage(pageIndex: number): () => void;
}

export default withStores(ArticleStore, I18nStore)(function ArticleList({ ids, pageCount, pageIndex, toPage, useStore }: Props) {

  const articleStore = useStore(ArticleStore);
  const i18nStore = useStore(I18nStore);

  const items = ids.map((id) => {
    return articleStore.state.articleGroups[id];
  });

  return (
    <div>
      {items
        .map((nodes) => {
          const node = articleStore.getNodeFromLang(nodes[0].frontmatter.id, i18nStore.language);
          return (
            <ArticleItem
              article={node}
              key={node.frontmatter.id}
              currentArticleLanguage={node.frontmatter.lang}
            />
          );

        })
      }
      <PageIndicator pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
    </div>
  )
});
