import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import { ArticleNode } from "@/models/ArticleNode";
import { useI18n } from "@/i18n";

export function useArticleOfCurrentLang(articleId: string): ArticleNode {
  const i18n = useI18n();
  const metadataStore = useStore(MetadataStore);

  return metadataStore.getArticleOfLang(articleId, i18n.currentLanguage.id);
}
