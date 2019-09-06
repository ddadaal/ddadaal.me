import { useStore } from "simstate";
import I18nStore from "@/stores/I18nStore";
import MetadataStore from "@/stores/MetadataStore";
import { ArticleNode } from "@/models/ArticleNode";

export function useArticleOfCurrentLang(articleId: string): ArticleNode {
  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  return metadataStore.getArticleOfLang(articleId, i18nStore.language);
}
