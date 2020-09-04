import { useState, useCallback } from "react";

export type Theme = "dark" | "light";

export function ThemeStore(defaultTheme: Theme = "dark") {
  const [theme, setTheme] = useState(defaultTheme);

  const changeTheme = useCallback(() => {
    setTheme((t) => t === "dark" ? "light" : "dark");
  }, []);

  return { theme, setTheme, changeTheme };
}
