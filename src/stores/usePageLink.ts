import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { MetadataStore } from "@/stores/MetadataStore";

export function usePageLink(articleId: string) {
  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  return metadataStore.getArticleOfLang(articleId, i18nStore.language).path;
}
