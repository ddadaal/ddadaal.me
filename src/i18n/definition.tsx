import cn from "@/i18n/definitions/cn";
import en from "@/i18n/definitions/en";

export const allLanguages = [cn, en];

export type Language = typeof cn;

export function getLanguage(langString: string): Language {
  const language = allLanguages.find((x) => x.metadata.langStrings.includes(langString));
  if (!language) { throw `Invalid lang string ${langString}`; }
  return language;
}

export function getDefinitions(langString: string): Language["definitions"] {
  return getLanguage(langString).definitions;
}

export type Definitions = ReturnType<typeof getDefinitions>;
