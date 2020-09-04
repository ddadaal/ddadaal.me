import { lang } from "@/i18n";

export type TLink = {
  mode?: "startsWith" | "exact";
  textId: string;
  href: string;
  onClick?: () => void;
};

const root = lang.headers;

export const links = [
  { href: "/", textId: root.home,  mode: "exact" },
  { href: "/articles", textId: root.articles, mode: "startsWith" },
  { href: "/resume", textId: root.resume, mode: "startsWith" },
] as TLink[];
