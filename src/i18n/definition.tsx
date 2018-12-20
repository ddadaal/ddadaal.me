import cn from "./lang/cn";
import en from "./lang/en";

export const allLanguages = [ cn, en ];

export type Language = typeof en;

export function getLanguage(lang: string) {
  return allLanguages.find((x) => x.languages.includes(lang))!;
}

export function getDefinitions(lang: string) {
  return getLanguage(lang).definitions;
}

export type Definitions = ReturnType<typeof getDefinitions>;
