import cn from "@/i18n/definitions/cn";
import en from "@/i18n/definitions/en";

export const allLanguages = [ cn, en ];

export type Language = typeof cn;

export function getLanguage(lang: string) {
  return allLanguages.find((x) => x.languages.includes(lang))!;
}

export function getDefinitions(lang: string) {
  return getLanguage(lang).definitions;
}

export type Definitions = ReturnType<typeof getDefinitions>;
