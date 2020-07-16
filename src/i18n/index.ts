import cn from "./cn";
import en from "./en";

const allLanguages = [cn, en];

// Import the factory function
import { createI18nContext, I18nStore, I18nStoreDef } from "simstate-i18n";
import { useStore } from "simstate";

// Create the I18nContext with all the languages
const i18nContext = createI18nContext([cn, en]);

// Destruct the members for easier usage
// Recommendation: rename the idAccessor to lang for shorter typing
const { getLanguage, idAccessor: lang } = i18nContext;

type Language = typeof cn;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}

export { i18nContext, getLanguage, lang, en, cn, Language, allLanguages };
