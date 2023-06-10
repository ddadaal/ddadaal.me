"use client";

import classNames from "classnames";
import Link from "next/link";
import { SearchBar, TagCounts } from "src/app/articles/cards";
import { ArticleListItem } from "src/components/article/ArticleListItem";
import { ArticleListInfo } from "src/data/articles";

interface Props {
  articles: ArticleListInfo[];
  pageNum: number;
  totalPages: number;
  tagCounts: TagCounts;
  articleCount: number;
}

export const ArticleList = ({ articles, pageNum, totalPages, tagCounts, articleCount }: Props) => {
  return (
    <div>
      <div className="lg:hidden max-w-full my-4">
        <SearchBar showTags tagCounts={tagCounts} articleCount={articleCount} />
      </div>
      <div className="space-y-8">
        {articles.map((article) => (
          <ArticleListItem
            key={article.id}
            article={article}
          />
        ))}
      </div>
      <div className="flex justify-center w-full my-4">
        <div className="join flex-wrap">
          {
            Array.from({ length: totalPages }, (_, i) => i + 1).map((x) => (
              <Link key={x} href={`/articles/${x}`}>
                <button className={classNames("join-item", "btn", { "btn-active": x === pageNum })}>
                  {x}
                </button>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
};
