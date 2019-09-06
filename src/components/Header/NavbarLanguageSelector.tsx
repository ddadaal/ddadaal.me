import React, { useCallback } from "react";
import { useStore } from "simstate";
import I18nStore from "@/stores/I18nStore";
import MetadataStore from "@/stores/MetadataStore";
import LanguageSelector from "@/components/LanguageSelector";
import { navigate } from "gatsby";
import ArticleStore from "@/stores/ArticleStore";
import { allLanguages, getLanguage } from "@/i18n/definition";

const NavbarLanguageSelector: React.FC = () => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);
  const articleStore = useStore(ArticleStore);

  const { language, changeLanguage } = i18nStore;

  const change = useCallback((lang: string) => {
    changeLanguage(lang);
    const article = articleStore.article;
    if (article) {
      const targetNode = metadataStore.getArticleOfLang(article.frontmatter.id, getLanguage(lang));
      if (targetNode) {
        navigate(targetNode.path);
      }
    }
  }, [articleStore]);

  return (
    <LanguageSelector
      allLanguages={allLanguages}
      currentLanguage={language.name}
      changeLanguage={change}
      prompt={language.definitions.languageSelector.select}
    />
  );
};

export default NavbarLanguageSelector;
