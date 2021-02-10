import cn from "./cn";

const en = () => import("./en").then((x) => x.default);

// Import the factory function
import { createI18nContext, I18nStore, I18nStoreDef } from "simstate-i18n";
import { useStore } from "simstate";

// Create the I18nContext with all the languages
const i18nContext = createI18nContext(cn, { en });

// Destruct the members for easier usage
// Recommendation: rename the idAccessor to lang for shorter typing
const { getLanguage, idAccessor: lang } = i18nContext;

const languageNames = {
  cn: "简体中文",
  en: "English",
};

const languageIds = {
  cn: "zh_CN",
  en: "en_US",
};

type Language = typeof cn;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18nStore() {
  return useStore(I18nStore) as I18nStoreDef<Language["definitions"], Language>;
}

export { i18nContext, getLanguage, languageNames, languageIds, lang, cn, Language };
