import React from "react";
import { useStores } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import { LocationStore } from "@/stores/LocationStore";
import LanguageSelector from "@/components/LanguageSelector";
import { navigate } from "gatsby";

const NavbarLanguageSelector = () => {

  const [i18nStore, articleStore] = useStores(I18nStore, ArticleStore);
  const { state, allLanguages, changeLanguage } = i18nStore;

  const change = (lang: string) => {
    changeLanguage(lang);
    // const article = articleStore.state.currentArticle;
    // if (article) {
    //   const targetNode = articleStore.getNodeFromLang(article.frontmatter.id, i18nStore.getLanguage(lang)!);
    //   if (targetNode) {
    //     navigate(targetNode.path);
    //   }
    // }
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
