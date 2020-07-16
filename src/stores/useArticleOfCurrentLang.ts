import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import { ArticleNode } from "@/models/ArticleNode";
import { useI18nStore } from "@/i18n";

export function useArticleOfCurrentLang(articleId: string): ArticleNode {
  const i18nStore = useI18nStore();
  const metadataStore = useStore(MetadataStore);

  return metadataStore.getArticleOfLang(articleId, i18nStore.currentLanguage);
}
