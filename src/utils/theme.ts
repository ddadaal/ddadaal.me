"use client";

import { useCallback, useEffect, useState } from "react";

const THEME_COOKIE_KEY = "ddadaal.me-theme";

import themeConfig from "./themes.json";

export { themeConfig };


export type Theme = keyof typeof themeConfig;

export const themes = Object.keys(themeConfig) as Theme[];

export const ThemeStore = () => {

  const [theme, setThemeInner] = useState<Theme>("dark");

  useEffect(() => {
    const themeInStorage = localStorage.getItem(THEME_COOKIE_KEY) as Theme;
    if (!themes.includes(themeInStorage)) {
      setThemeInner("dark");
    } else {
      setThemeInner(themeInStorage);
    }
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem(THEME_COOKIE_KEY, theme);
    setThemeInner(theme);
  }, []);

  return { theme, setTheme };
};

