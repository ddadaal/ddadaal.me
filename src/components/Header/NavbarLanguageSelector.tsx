import { navigate } from "gatsby";
import React, { useCallback, useState } from "react";
import { useStore } from "simstate";

import LanguageSelector from "@/components/LanguageSelector";
import { languageInfo, TextId, useI18n } from "@/i18n";
import ArticleStore from "@/stores/ArticleStore";
import MetadataStore from "@/stores/MetadataStore";

const languageNames = Object.entries(languageInfo)
  .reduce((prev, [id, info]) => {
    prev[id] = info.name;
    return prev;
  }, {});

const NavbarLanguageSelector: React.FC = () => {

  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();
  const articleStore = useStore(ArticleStore);

  const [switchingTo, setSwitchingTo] = useState<TextId | undefined>(undefined);

  const { currentLanguage, setLanguageById } = i18n;

  const change = useCallback(async (id: TextId) => {
    setSwitchingTo(id);
    await setLanguageById(id).finally(() => {
      setSwitchingTo(undefined);
    });

    const article = articleStore.article;
    if (article) {
      const targetNode = metadataStore.getArticleOfLang(article.frontmatter.id, id);
      if (targetNode) {
        navigate(targetNode.path);
      }
    }
  }, [articleStore]);

  return (
    <LanguageSelector
      languageNames={languageNames}
      currentLanguage={
        switchingTo
          ? i18n.translate(
            "languageSelector.switchingTo", [languageNames[switchingTo]]) as string
          : languageNames[currentLanguage.id]
      }
      changeLanguage={change}
      prompt={i18n.translate("languageSelector.select")}
    />
  );
};

export default NavbarLanguageSelector;
