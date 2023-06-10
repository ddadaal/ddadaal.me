"use client";

import classNames from "classnames";
import MiniSearch, { SearchResult } from "minisearch";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaSort } from "react-icons/fa";
import { IndexedArticleInfo } from "src/app/articles/search/page";
import { ArticleListItem } from "src/components/article/ArticleListItem";
import { ArticleListInfo } from "src/data/articles";
import { Localized, prefix, useI18n } from "src/i18n";
import { fromArticleTime } from "src/utils/datetime";

interface Props {
  index: string;
  articleListInfos: ArticleListInfo[];
}

const intParse = (str: string, defaultValue = 1) => {
  const result = parseInt(str);
  return isNaN(result) ? defaultValue : result;
};

const ORDERS = ["similarity", "time", "timeDesc"] as const;

type Order = (typeof ORDERS)[number];

const PAGE_SIZE = 5;

const orderPrefix = prefix("search.order.");

export const ArticleSearchPage = ({ index, articleListInfos }: Props) => {

  const i18n = useI18n();

  const [miniSearch] = useState(() =>
    MiniSearch.loadJSON<IndexedArticleInfo>(index, {
      fields: ["title", "content", "tags"],
    }));

  const search = Object.fromEntries(useSearchParams().entries());
  const pathname = usePathname();

  const query = search.query ?? "";
  const page = intParse(search.page ?? "1", 1);
  let order = search.order as Order | undefined;
  if (!order || !(ORDERS as readonly string[]).includes(order)) {
    order = ORDERS[0];
  }

  const searchResult = miniSearch.search(query);

  searchResult.sort((a, b) => {
    if (order === "similarity") {
      return a.score - b.score;
    }

    const findArticle = (s: SearchResult) => {
      const info = articleListInfos.find((x) => x.id === s.id)!;
      return info.langVersions.find((x) => x.lang === i18n.currentLanguage.id) ?? info.langVersions[0];
    };

    const aInfo = findArticle(a);
    const bInfo = findArticle(b);

    const aToBDiff = fromArticleTime(aInfo.date).toMillis() - fromArticleTime(bInfo.date).toMillis();

    return order === "time" ? aToBDiff : -aToBDiff;

  });

  const totalPages = Math.ceil(searchResult.length / PAGE_SIZE);

  return (
    <div className="p-2">
      <div className="flex justify-between py-2">
        <h1 className="text-3xl flex items-center">
          <Localized
            id={"search.title"}
            args={[
              <strong key={"query"}>{query}</strong>,
            ]}
          />
         ({searchResult.length})
        </h1>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            <FaSort />
            <Localized id={orderPrefix(order)} />
          </label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {
              ORDERS.map((x) => (
                <li key={x}>
                  <Link href={{ pathname, query: { ...search, order: x } }}>
                    <Localized id={orderPrefix(x)} />
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
      <div className="space-y-6">
        {
          searchResult
            .slice(PAGE_SIZE * (page - 1), PAGE_SIZE * page)
            .map((r) => {
              const info = articleListInfos.find((x) => x.id === r.id)!;

              return (
                <ArticleListItem key={info.id} article={info} />
              );
            })
        }
      </div>
      <div className="flex justify-center w-full my-2">
        <div className="join">
          {
            Array.from({ length: totalPages }, (_, i) => i + 1).map((x) => (
              <Link key={x} href={{ pathname, query: { ...search, page: x } }}>
                <button className={classNames("join-item", "btn", { "btn-active": x === page })}>
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
