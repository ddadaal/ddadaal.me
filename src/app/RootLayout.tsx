"use client";

import React, { useState } from "react";
import { createStore, StoreProvider, useStore } from "simstate";
import { defaultLocale, getLanguage, Provider, useI18n } from "src/i18n";
import zhCN from "src/i18n/definitions/zh-CN.json";
import { I18nStore } from "src/i18n/store";
import { ThemeStore } from "src/utils/theme";

const RootLayoutInner = ({ children }: { children: React.ReactNode }) => {
  const i18n = useI18n();

  const themeStore = useStore(ThemeStore);

  return (
    <html
      lang={getLanguage(i18n.currentLanguage.id).htmlLang}
      data-theme={themeStore.theme === "auto" ? undefined : themeStore.theme}
      className="scroll-smooth"
    >
      <body className="w-full">
        {children}
      </body>
    </html>
  );
};

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [themeStore] = useState(() => createStore(ThemeStore));
  const [i18nStore] = useState(() => createStore(I18nStore));

  return (
    <Provider initialLanguage={{
      id: defaultLocale,
      definitions: zhCN,
    }}
    >
      <StoreProvider stores={[themeStore, i18nStore]}>
        <RootLayoutInner>
          {children}
        </RootLayoutInner>
      </StoreProvider>
    </Provider>
  );
};
