"use client";

import classNames from "classnames";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { HTMLAttributeAnchorTarget } from "react";
import { FaCode, FaGlobe, FaRegCommentDots, FaRss, FaSearch, FaTags } from "react-icons/fa";
import { getLocaleTag } from "src/data/tags";
import { Localized, useI18n } from "src/i18n";

import styles from "./search.module.css";

const IconLink = ({ href, children, target }: {
  href: string, children: React.ReactNode, target?: HTMLAttributeAnchorTarget
}) => (
  <Link
    className="link link-hover flex items-center my-1 space-x-1"
    href={href}
    target={target}
  >
    {children}
  </Link>
);

export const WebsiteCard = () => {
  return (
    <div className="card card-bordered bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <FaGlobe /> ddadaal.me | <Localized id="blogIntro.subtitle" />
        </h2>
        <p>
          <Localized id="blogIntro.description2" />
        </p>
        <div>
          <IconLink
            href="https://github.com/ddadaal/ddadaal.me"
            target="_blank"
          >
            <FaCode />
            <span><Localized id={"blogIntro.sourceCode"} /></span>
          </IconLink>
          <IconLink href="/rss.xml" target="_blank">
            <FaRss /> <span>RSS</span>
          </IconLink>
          <IconLink href="/feedback">
            <FaRegCommentDots />
            <span>
              <Localized id={"blogIntro.feedback"} />
            </span>
          </IconLink>
        </div>
      </div>
    </div>
  );
};

export type TagCounts = {
  tag: string;
  count: number;
}[];

interface TagsCardProps {
  tagCounts: TagCounts;
}

const TagsPanel = ({ tagCounts }: TagsCardProps) => {

  const i18n = useI18n();

  return (
    <div className="flex flex-wrap gap-2">
      {tagCounts.map(({ tag, count }) => {
        return (
          <Link
            href={{ pathname: "/articles/search", query: { query: tag } }}
            key={tag}
            className="rounded-box p-1 text-sm text-base-content bg-base-200 hover:bg-base-300 transition"
          >
            {getLocaleTag(i18n.currentLanguage.id, tag)}
            <div className="badge badge-outline badge-accent text-accent-content ml-1 p-1">
              {count}
            </div>
          </Link>
        ); })}
    </div>
  );
};

export const TagsCard = ({ tagCounts }: TagsCardProps) => {

  return (
    <div className="card card-bordered bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <FaTags />
          <Localized id="tagsCard.title" />
        </h2>
        <TagsPanel tagCounts={tagCounts} />
      </div>
    </div>
  );
};

interface SearchCardProps {
  articleCount: number;
  tagCounts: TagCounts;
  showTags: boolean;
}

export const SearchBar = ({ articleCount, showTags, tagCounts }: SearchCardProps) => {

  const i18n = useI18n();

  const router = useRouter();

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className={classNames("form-control my-2", { [styles["search-bar"]]: showTags })}>
      <form
        className={"input-group"}
        action="/articles/search"
        method="GET"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/articles/search?query=" + e.currentTarget.query.value);
        }}
      >
        <input
          type="text"
          placeholder={i18n.translateToString("search.inputPlaceholder", [articleCount])}
          className={"input input-bordered w-full"}
          name="query"
          defaultValue={query ?? undefined}
        />
        <button type="submit" className="btn btn-square">
          <FaSearch />
        </button>
      </form>
      {
        showTags ? (
          <div id="search_bar_tags" className="hidden">
            <TagsPanel tagCounts={tagCounts} />
          </div>
        ) : undefined
      }
    </div>
  );

};

export const SearchCard = ({ articleCount, tagCounts, showTags }: SearchCardProps) => {


  return (
    <div className="card card-bordered bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          <FaSearch />
          <Localized id="search.cardTitle" />
        </h2>
        <div>
          <SearchBar articleCount={articleCount} showTags={showTags} tagCounts={tagCounts} />
        </div>
      </div>
    </div>
  );
};
