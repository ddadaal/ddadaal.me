import { useStore } from "simstate";

import { useI18n } from "@/i18n";
import { ArticleNode } from "@/models/ArticleNode";
import MetadataStore from "@/stores/MetadataStore";

export function useArticleOfCurrentLang(articleId: string): ArticleNode {
  const i18n = useI18n();
  const metadataStore = useStore(MetadataStore);

  return metadataStore.getArticleOfLang(articleId, i18n.currentLanguage.id);
}
