"use client";

import Link from "next/link";
import { getLanguage, useI18n } from "src/i18n";

export interface Props {
  basePath: string;
  className?: string;
  children?: React.ReactNode;
}

export const LocalizedArticleLink = ({ basePath, className, children }: Props) => {
  const i18n = useI18n();

  const language = getLanguage(i18n.currentLanguage.id);

  return (
    <Link href={basePath + "/" + language.simplified} className={className}>
      {children}
    </Link>
  );
};
