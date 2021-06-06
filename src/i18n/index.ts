import { createI18n, languageDictionary, TextIdFromLangDict } from "react-typed-i18n";

export const languages = languageDictionary({
  cn: () => import("./cn").then((x) => x.default),
  en: () => import("./en").then((x) => x.default),
});

export const languageInfo = {
  cn: {
    gitalkLangId: "zh-CN",
    langStrings: ["cn", "zh-CN", "zh"],
    detailedId: "zh-CN",
    name: "简体中文",
  },
  en: {
    gitalkLangId: "en",
    langStrings: ["en", "en-US"],
    detailedId: "en-US",
    name: "English",
  },
};

export const { Localized, Provider, i, p, useI18n } = createI18n(languages);

export type TextId = TextIdFromLangDict<typeof languages>;

export type LanguageId = keyof typeof languages;
