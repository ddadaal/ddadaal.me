import React, { useCallback } from "react";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import LanguageSelector from "@/components/LanguageSelector";
import { navigate } from "gatsby";
import ArticleStore from "@/stores/ArticleStore";
import { useI18nStore, languageNames } from "@/i18n";

const NavbarLanguageSelector: React.FC = () => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useI18nStore();
  const articleStore = useStore(ArticleStore);

  const { currentLanguage, changeLanguage, switchingToId } = i18nStore;

  const change = useCallback(async (id: string) => {
    await changeLanguage(id);
    const article = articleStore.article;
    if (article) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const targetNode = metadataStore.getArticleOfLang(article.frontmatter.id, id);
      if (targetNode) {
        navigate(targetNode.path);
      }
    }
  }, [articleStore]);

  return (
    <LanguageSelector
      languageNames={languageNames}
      currentLanguage={currentLanguage.name}
      changeLanguage={change}
      prompt={
        currentLanguage.definitions.languageSelector.select
      }
    />
  );
};

export default NavbarLanguageSelector;
