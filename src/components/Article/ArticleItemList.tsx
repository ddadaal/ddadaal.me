import React from "react";
import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import ArticleItem from "./ArticleItem";
import PageIndicator from "../PageIndicator";
import { useStore } from "simstate";

interface Props {
  ids: string[];
  pageCount: number;
  pageIndex: number;
  toPage(pageIndex: number): () => void;
}

export default function ArticleList({ ids, pageCount, pageIndex, toPage }: Props) {

  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  const items = ids.map((id) => {
    return metadataStore.articleIdMap.get(id)!!;
  });

  return (
    <div>
      {items
        .map((nodes) => {
          const node = metadataStore.getArticleOfLang(nodes[0].frontmatter.id, i18nStore.language);
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
  );
}
