import React from "react";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import { LocationStore } from "@/stores/LocationStore";
import LanguageSelector from "@/components/LanguageSelector";
import { navigate } from "gatsby";
import { CurrentArticleStore } from "@/stores/CurrentArticleStore";

const NavbarLanguageSelector = () => {

  const articleStore = useStore(ArticleStore);
  const i18nStore = useStore(I18nStore);
  const currentArticleStore = useStore(CurrentArticleStore);

  const { state, allLanguages, changeLanguage } = i18nStore;

  const change = (lang: string) => {
    changeLanguage(lang);
    const article = currentArticleStore.state.article;
    if (article) {
      const targetNode = articleStore.getNodeFromLang(article.frontmatter.id, i18nStore.getLanguage(lang)!);
      if (targetNode) {
        navigate(targetNode.path);
      }
    }
  };

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
