import { Lang } from "react-typed-i18n";

import type zhCN from "./definitions/zh-CN.json";

export const dictionaries = {
  "zh-CN": () => import("./definitions/zh-CN.json").then((x) => x.default),
  "en-US": () => import("./definitions/en-US.json").then((x) => x.default),
};

export const languages = {
  "zh-CN": {
    gitalkLangId: "zh-CN",
    simplified: "cn",
    langStrings: ["cn", "zh-CN", "zh"],
    htmlLang: "zh-CN",
    name: "简体中文",
    icon: () => "🇨🇳 ",
  },
  "en-US": {
    gitalkLangId: "en",
    simplified: "en",
    langStrings: ["en", "en-US"],
    htmlLang: "en-US",
    name: "English",
    icon: () => "🇺🇸 ",
  },
};


export type Locale = keyof typeof languages;

export const getLanguage = (locale: string) => languages[locale as Locale];

export type TextId = Lang<typeof zhCN>;

export const defaultLocale: Locale = "zh-CN";

export const locales: Locale[] = Object.keys(languages) as Locale[];
