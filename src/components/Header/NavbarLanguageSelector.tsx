import React, { useCallback } from "react";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { MetadataStore } from "@/stores/MetadataStore";
import LanguageSelector from "@/components/LanguageSelector";
import { navigate } from "gatsby";
import { ArticleStore } from "@/stores/ArticleStore";
import { allLanguages, getLanguage } from "@/i18n/definition";

const NavbarLanguageSelector: React.FC = () => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);
  const articleStore = useStore(ArticleStore);

  const { state, changeLanguage } = i18nStore;

  const change = useCallback((lang: string) => {
    changeLanguage(lang);
    const article = articleStore.state.article;
    if (article) {
      const targetNode = metadataStore.getArticleOfLang(article.frontmatter.id, getLanguage(lang));
      if (targetNode) {
        navigate(targetNode.path);
      }
    }
  }, []);

  return (
    <LanguageSelector
      allLanguages={allLanguages}
      currentLanguage={state.language.name}
      changeLanguage={change}
      prompt={state.language.definitions.languageSelector.select}
    />
  );
};

export default NavbarLanguageSelector;
