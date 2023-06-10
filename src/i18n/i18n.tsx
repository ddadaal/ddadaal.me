"use client";

import { createI18n } from "react-typed-i18n";
import { dictionaries } from "src/i18n/languages";

const i18n = createI18n(dictionaries);

export const Localized = i18n.Localized;
export const Provider = i18n.Provider;
export const useI18n = i18n.useI18n;
export const prefix = i18n.prefix;


