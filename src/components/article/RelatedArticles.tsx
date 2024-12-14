"use client";

import { FaArrowRight } from "react-icons/fa";
import { LocalizedArticleLink } from "src/components/article/LocalizedArticleLink";
import { getArticleBasePath } from "src/data/articleBasePath";
import { getLanguage, Localized, useI18n } from "src/i18n";

export interface RelatedArticle {
  id: string;
  langVersions: {
    lang: string;
    title: string;
    time: string;
    last_updated?: string;
    excerpt: string;
    absolute_path?: string;
  }[];
}

interface Props {
  relatedArticles: RelatedArticle[];
}

export const RelatedArticles = ({ relatedArticles }: Props) => {
  const i18n = useI18n();

  if (relatedArticles.length === 0) {
    return undefined;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 flex items-center">
        <FaArrowRight />
        <span className="mx-2">
          <Localized id="articlePage.relatedArticles.text" />
        </span>
      </h2>
      <div className="flex flex-wrap gap-2">
        {relatedArticles.map((x) => {
          const langVersion = x.langVersions.find((y) =>
            y.lang === getLanguage(i18n.currentLanguage.id).simplified) ?? x.langVersions[0];
          return (
            <div key={x.id} className="card w-96 bg-base-100 shadow-lg hover:shadow-xl transition">
              <div className="card-body">
                <span className="text-sm">
                  {langVersion.time}
                </span>
                <LocalizedArticleLink basePath={getArticleBasePath(x)}>
                  <h2 className="card-title">
                    {langVersion.title}
                  </h2>
                </LocalizedArticleLink>
                <p>
                  {langVersion.excerpt}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
