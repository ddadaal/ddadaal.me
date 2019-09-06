import { ArticleIdMap } from "@/models/ArticleIdMap";
import { Language } from "@/i18n/definition";
import { ArticleNode } from "@/models/ArticleNode";
import { groupBy } from "@/utils/groupBy";
import { useMemo, useCallback } from "react";

export type LangPathMap = Map<string, string>;

export function matchLangWithCurrentLanguage(lang: string, currentLanguage: Language): boolean {
  return currentLanguage.languages.includes(lang);
}

function noSuchArticle(articleId: string): string {
  return `No such article with id ${articleId}!`
}

export default function MetadataStore(lastUpdated: string, articleNodes: ArticleNode[], baseUrl: string, tagMap: TagMap) {

  const articleIdMap: ArticleIdMap = useMemo(() => {
    return groupBy(articleNodes.map((article) => {
      const { frontmatter: { id, absolute_path, lang } } = article;
      article.path = `${absolute_path || `/articles/${id}`}/${lang}`;
      return article;
    }), (article) => article.frontmatter.id);

  }, [articleNodes]);

  const articleCount = useMemo(() => Array.from(articleIdMap.values()).filter((group) => !group[0].frontmatter.ignored_in_list).length, [articleIdMap]);

  const getArticleOfLang = useCallback((id: string, language: Language): ArticleNode => {
    const group = articleIdMap.get(id);

    if (!group) {
      throw noSuchArticle(id);
    }

    const node = group.find((x) => matchLangWithCurrentLanguage(x.frontmatter.lang, language)) || group[0];
    return node;
  }, []);

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
  }, []);

  const getTagOfLang = useCallback((tag: string, language: Language): string | null => {
    const info = tagMap.get(tag);
    if (!info) { return null; }

    const { variations } = info;
    if (typeof variations === "string") {
      return variations;
    }
    return variations[language.id] || variations[0];
  }, []);

  const getAllVariationsOfTag = useCallback((tag: string): string[] => {
    const variations = [tag];

    const value = tagMap.get(tag);
    if (value && typeof (value.variations) === "object") {
      Object.values(value.variations).forEach((variation) => {
        variations.push(variation);
      });
    }
    return variations;
  }, []);

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
  }, []);

  const getCountOfTag = useCallback((tag: string): number => {
    const info = tagMap.get(tag);
    return info ? info.count : 0;
  }, []);

  return {
    lastUpdated,
    baseUrl,
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
