"use client";

import Link from "next/link";
import { ArticleFrontmatter } from "src/components/article/ArticleFrontmatter";
import { ArticleListInfo } from "src/data/articles";
import { useI18n } from "src/i18n";



export interface ArticleListItemProps {
  article: ArticleListInfo;
}

export const ArticleListItem = ({ article }: ArticleListItemProps) => {

  const i18n = useI18n();

  const articleOfLang = article.langVersions.find((x) => x.lang === i18n.currentLanguage.id) ?? article.langVersions[0];

  return (
    <div>
      <Link
        className="text-3xl my-2 link link-hover block break-words"
        href={`/articles/${article.id}`}
      >
        {articleOfLang.title}
      </Link>
      <ArticleFrontmatter
        articleId={article.id}
        info={articleOfLang}
        langVersions={article.langVersions.map((x) => x.lang)}
      />
      <div className="break-words">
        {articleOfLang.excerpt}
      </div>
    </div>
  );
};

