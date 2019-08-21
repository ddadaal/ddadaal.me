import cn from "@/i18n/definitions/cn";
import en from "@/i18n/definitions/en";

export const allLanguages = [cn, en];

export type Language = typeof cn;

export function getLanguage(lang: string): Language {
  const language = allLanguages.find((x) => x.languages.includes(lang));
  if (!language) { throw `Invalid lang string ${lang}`; }
  return language;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getDefinitions(lang: string) {
  return getLanguage(lang).definitions;
}

export type Definitions = ReturnType<typeof getDefinitions>;
