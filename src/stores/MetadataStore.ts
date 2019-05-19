import { Store } from "simstate";
import { Statistics } from "@/models/Statistics";
import { ArticleIdMap } from "@/models/ArticleIdMap";
import { Language } from "@/i18n/definition";
import { ArticleNode } from "@/models/ArticleNode";
import { groupBy } from "@/utils/groupBy";

export type LangPathMap = Map<string, string>;

export function createArticleIdMap(articles: ArticleNode[]): ArticleIdMap {

  return groupBy(articles.map((article) => {
    const { frontmatter: { id, absolute_path, lang }} = article;
    article.path = `${absolute_path || `/articles/${id}`}/${lang}`;
    return article;
  }), (article) => article.frontmatter.id);
}

export function matchLangWithCurrentLanguage(lang: string, currentLanguage: Language) {
  return currentLanguage.languages.includes(lang);
}

export class MetadataStore extends Store<{}> {

  constructor(
    public statistics: Statistics,
    public articleIdMap: ArticleIdMap,
    public baseUrl: string,
    public tagMap: TagMap,
  ) {
    super();
  }

  getArticleOfLang(id: string, language: Language): ArticleNode {
    const group = this.articleIdMap.get(id)!!;
    const node = group.find((x) => matchLangWithCurrentLanguage(x.frontmatter.lang, language)) || group[0];
    return node;
  }

  getLangPathMap(id: string): LangPathMap {
    const group = this.articleIdMap.get(id)!!;
    const map: LangPathMap = new Map();

    group.forEach((node) => {
      map.set(node.frontmatter.lang, node.path);
    });

    return map;
  }

  getTagOfLang(tag: string, language: Language): string | null {
    const info = this.tagMap.get(tag);

    if (!info) {
      return null;
    }

    const { variations } = info;

    if (typeof variations === "string") {
      return variations;
    }

    return variations[language.id] || variations[0];
  }

  getAllVariationsOfTag(tag: string): string[] {
    const variations = [tag];

    const value = this.tagMap.get(tag);
    if (value && typeof (value.variations) === "object") {
      Object.values(value.variations).forEach((variation) => {
        variations.push(variation);
      });
    }
    return variations;
  }

  getAllTagsOfLang(language: Language): string[] {
    const tags = [] as string[];
    this.tagMap.forEach(({ count, variations }, key) => {
      if (typeof variations === "string") {
        tags.push(variations);
      } else {
        tags.push(variations[language.id] || variations[0]);
      }

    });

    return tags;
  }

  getCountOfTag(tag: string): number {
    const info = this.tagMap.get(tag);
    return info ? info.count : 0;
  }
}
