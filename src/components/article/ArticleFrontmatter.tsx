"use client";

import Link from "next/link";
import { join } from "path";
import { FaCalendar, FaClock, FaFileWord, FaGlobe, FaTag } from "react-icons/fa";
import { getLocaleTag } from "src/data/tags";
import { languages, Localized, useI18n } from "src/i18n";
import { formatDateTime, fromArticleTime } from "src/utils/datetime";

export interface ArticleFrontmatterInfo {
  tags?: string[];
  date: string;
  wordCount: number;
  readingTime: number;
  absolute_path?: string;
}

interface Props {
  articleId: string;
  info: ArticleFrontmatterInfo;
  langVersions: string[];
}

export const ArticleFrontmatter = ({ articleId, info, langVersions }: Props) => {

  const i18n = useI18n();

  return (

    <div className="flex flex-wrap gap-3 my-2 text-sm">
      {
        info.tags ? (
          <div className="flex items-center">
            <FaTag />
            {info.tags.map((x) => (
              <div key={x} className="badge badge-accent mx-0.5 text-accent-content">
                {getLocaleTag(i18n.currentLanguage.id, x)}
              </div>
            ))}
          </div>
        ) : undefined
      }
      <div className="flex items-center">
        <FaCalendar />
        <span className="mx-0.5">{formatDateTime(fromArticleTime(info.date))}</span>
      </div>
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
            <Link key={x} className="link link-hover" href={join(info.absolute_path ?? `/articles/${articleId}`, x)}>
              {Object.values(languages).find((y) => y.simplified === x)?.name ?? x}
            </Link>
          ))}
        </span>
      </div>
    </div>

  );
};
