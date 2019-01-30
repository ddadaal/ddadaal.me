import cn from "@/configs/i18nDefinitions/cn";
import en from "@/configs/i18nDefinitions/en";

export const allLanguages = [ cn, en ];

export type Language = typeof cn;

export function getLanguage(lang: string) {
  return allLanguages.find((x) => x.languages.includes(lang))!;
}

export function getDefinitions(lang: string) {
  return getLanguage(lang).definitions;
}

export type Definitions = ReturnType<typeof getDefinitions>;
