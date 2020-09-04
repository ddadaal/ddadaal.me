import { ArticleIdMap } from "@/models/ArticleIdMap";
import { Language } from "@/i18n";
import { ArticleNode } from "@/models/ArticleNode";
import { groupBy } from "@/utils/groupBy";
import { useMemo, useCallback } from "react";
import { SiteMetadata } from "@/models/SiteMetadata";
import { DateTime } from "luxon";
import { formatDateTime } from "@/utils/datetime";

export type LangPathMap = Map<string, string>;

function noSuchArticle(articleId: string): string {
  return `No such article with id ${articleId}!`;
}

export default function MetadataStore(siteMetadata: SiteMetadata, articleNodes: ArticleNode[], tags: Tag[]) {

  const tagMap = useMemo(() => {
    // calculate tag map with article nodes and tags
    const tagMap = new Map() as TagMap;
    tags.forEach(({ tag, ...variations }) => {
      tagMap.set(tag, { count: 0, variations });
    });

    // for each tags
    articleNodes.forEach((node) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags.forEach((tag) => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, { count: 1, variations: tag });
          } else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            tagMap.get(tag)!.count++;
          }
        });
      }
    });
    return tagMap;
  }, [articleNodes, tags]);

  const articleIdMap: ArticleIdMap = useMemo(() => {
    const map = groupBy(articleNodes.map((article) => {
      const { frontmatter: { id, absolute_path } } = article;
      article.path = `${absolute_path || `/articles/${id}`}`;
      return article;
    }), (article) => article.frontmatter.id);

    // replicate the logic from page creation (the cn or first version of article has no lang postfix)
    Array.from(map.values()).forEach((values) => {
      // sort the articles by lang
      values.sort((a, b) => a.frontmatter.lang.localeCompare(b.frontmatter.lang, "en"));

      // except the chinese or the first version, append lang prefix
      const exception = values.find((x) => x.frontmatter.lang === "cn") || values[0];
      values.forEach((article) => {
        if (article === exception) { return; }
        article.path += `/${article.frontmatter.lang}`;
      });
    });

    return map;
  }, [articleNodes]);

  const articleCount = useMemo(() =>
    Array.from(articleIdMap.values())
      .filter((group) => !group[0].frontmatter.ignored_in_list)
      .length, [articleIdMap]);

  const getArticleOfLang = useCallback((id: string, languageId: string): ArticleNode => {
    const group = articleIdMap.get(id);

    if (!group) {
      throw noSuchArticle(id);
    }

    const node = group.find((x) => x.frontmatter.lang === languageId) || group[0];
    return node;
  }, [articleIdMap]);

  const getLangPathMap = useCallback((id: string): LangPathMap => {
    const group = articleIdMap.get(id);

    if (!group) {
      throw noSuchArticle(id);
    }

    const map: LangPathMap = new Map();

    group.forEach((node) => {
      map.set(node.frontmatter.lang, node.path);
    });

    return map;
  }, [articleIdMap]);

  const getTagOfLang = useCallback((tag: string, language: Language): string | null => {
    const info = tagMap.get(tag);
    if (!info) { return null; }

    const { variations } = info;
    if (typeof variations === "string") {
      return variations;
    }
    return variations[language.id] || variations[0];
  }, [tagMap]);

  const getAllVariationsOfTag = useCallback((tag: string): string[] => {
    const variations = [tag];

    const value = tagMap.get(tag);
    if (value && typeof (value.variations) === "object") {
      Object.values(value.variations).forEach((variation) => {
        variations.push(variation);
      });
    }
    return variations;
  }, [tagMap]);

  const getAllTagsOfLang = useCallback((language: Language): string[] => {
    const tags = [] as string[];
    tagMap.forEach(({ variations }) => {
      if (typeof variations === "string") {
        tags.push(variations);
      } else {
        tags.push(variations[language.id] || variations[0]);
      }
    });

    return tags;
  }, [tagMap]);

  const getCountOfTag = useCallback((tag: string): number => {
    const info = tagMap.get(tag);
    return info ? info.count : 0;
  }, [tagMap]);

  const formattedLastUpdate = useMemo(() => {
    return formatDateTime(DateTime.fromISO(siteMetadata.lastUpdated));
  }, [siteMetadata.lastUpdated]);

  return {
    siteMetadata: { ...siteMetadata, formattedLastUpdate },
    tagMap,
    articleCount,
    articleIdMap,
    getArticleOfLang,
    getLangPathMap,
    getTagOfLang,
    getAllTagsOfLang,
    getAllVariationsOfTag,
    getCountOfTag,
  };
}
