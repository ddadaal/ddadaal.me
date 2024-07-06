"use client";

import { useEffect } from "react";
import { useI18n } from "src/i18n/i18n";
import { languages, Locale } from "src/i18n/languages";

const LANGUAGE_KEY = "ddadaal.me-language";

export const I18nStore = () => {
  const i18n = useI18n();

  const setLanguageById = (lang: Locale) => {
    localStorage.setItem(LANGUAGE_KEY, lang);
    void i18n.setLanguageById(lang);
  };

  useEffect(() => {
    const lang = localStorage.getItem(LANGUAGE_KEY);
    if (lang) {
      if (!Object.keys(languages).includes(lang)) {
        localStorage.removeItem(LANGUAGE_KEY);
        return;
      }
      void i18n.setLanguageById(lang);
    }
  }, []);

  return { i18n, setLanguageById };
};
