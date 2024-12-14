"use client";

import classNames from "classnames";
import Link from "next/link";
import { join } from "path";
import { FaCalendar, FaCalendarPlus, FaClock, FaFileWord, FaGlobe, FaTag } from "react-icons/fa";
import { getArticleBasePath } from "src/data/articleBasePath";
import { getLocaleTag } from "src/data/tags";
import { languages, Localized, useI18n } from "src/i18n";
import { formatDateTime, fromArticleTime } from "src/utils/datetime";

export interface ArticleFrontmatterInfo {
  tags?: string[];
  date: string;
  last_updated?: string;
  wordCount: number;
  readingTime: number;
  absolute_path?: string;
}

interface Props {
  articleId: string;
  info: ArticleFrontmatterInfo;
  langVersions: string[];
  className?: string;
}

export const ArticleFrontmatter = ({ articleId, info, className, langVersions }: Props) => {
  const i18n = useI18n();

  return (

    <div className={classNames("flex flex-wrap gap-3 my-2 text-sm", className)}>
      {
        info.tags
          ? (
              <div
                className="flex flex-wrap gap-1 items-center"
              >
                <FaTag />
                {info.tags.map((x) => (
                  <Link
                    href={{ pathname: "/articles/search", query: { query: x } }}
                    key={x}
                    className="badge badge-accent mx-0.5 text-accent-content"
                  >
                    {getLocaleTag(i18n.currentLanguage.id, x)}
                  </Link>
                ))}
              </div>
            )
          : undefined
      }
      <div className="flex items-center" title={i18n.translateToString("articleFrontmatter.date")}>
        <FaCalendar />
        <span className="mx-0.5">{formatDateTime(fromArticleTime(info.date))}</span>
      </div>
      {
        info.last_updated
          ? (
              <div className="flex items-center" title={i18n.translateToString("articleFrontmatter.lastUpdated")}>
                <FaCalendarPlus />
                <span className="mx-0.5">{formatDateTime(fromArticleTime(info.last_updated))}</span>
              </div>
            )
          : undefined
      }
      <div className="flex items-center">
        <FaFileWord />
        <span className="mx-0.5">
          <Localized id="articleFrontmatter.wordCount" args={[info.wordCount]} />
        </span>
      </div>
      <div className="flex items-center">
        <FaClock />
        <span className="mx-0.5">
          <Localized id="articleFrontmatter.timeToRead" args={[Math.ceil(info.readingTime)]} />
        </span>
      </div>
      <div className="flex items-center">
        <FaGlobe />
        <span className="mx-0.5 space-x-1">
          {langVersions.map((x) => (
            <Link
              key={x}
              className="link link-hover"
              href={join(getArticleBasePath({ id: articleId, absolute_path: info.absolute_path }), x)}
            >
              {Object.values(languages).find((y) => y.simplified === x)?.name ?? x}
            </Link>
          ))}
        </span>
      </div>
    </div>

  );
};
