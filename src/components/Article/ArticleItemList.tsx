import React from "react";
import { useStore } from "simstate";
import styled from "styled-components";

import { useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";

import PageIndicator from "../PageIndicator";
import ArticleItem from "./ArticleItem";

interface Props {
  ids: string[];
  pageCount: number;
  pageIndex: number;
  toPage(pageIndex: number): () => void;
}

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ArticleList: React.FC<Props> = ({ ids, pageCount, pageIndex, toPage }) => {

  const i18n = useI18n();
  const metadataStore = useStore(MetadataStore);

  const items = ids.map((id) => {
    const item = metadataStore.articleIdMap.get(id);
    if (!item) { throw `Invalid articleId ${id}`; }
    return item;
  });

  return (
    <div>
      {items
        .map((nodes) => {
          const node = metadataStore.getArticleOfLang(
            nodes[0].frontmatter.id, i18n.currentLanguage.id);
          return (
            <ArticleItem
              article={node}
              key={node.frontmatter.id}
              currentArticleLanguage={node.frontmatter.lang}
            />
          );

        })
      }
      <PaginationContainer>
        <PageIndicator pageCount={pageCount} pageIndex={pageIndex} toPage={toPage} />
      </PaginationContainer>
    </div>
  );
};

export default ArticleList;
