import { Store } from "simstate";
import { Statistics } from "@/models/Statistics";
import { ArticleGroups } from "@/models/ArticleGroups";
import { Language } from "@/i18n/definition";
import { ArticleNode } from "@/models/ArticleNode";

export type LangPathMap = Map<string, string>;

export function createArticleGroups(articles: ArticleNode[]) {
  const articleGroups = {} as ArticleGroups;
  articles.forEach((node) => {
    const id = node.frontmatter.id;
    articleGroups[id] = articleGroups[id] || [];
    node.path = `${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`}/${node.frontmatter.lang}`;
    articleGroups[id].push(node);
  });

  return articleGroups;
}

export class MetadataStore extends Store<{}> {

  constructor(
    public statistics: Statistics,
    public articleGroups: ArticleGroups,
    public baseUrl: string,
    public tagMap: TagMap,
  ) {
    super();
  }

  getArticleOfLang(id: string, language: Language): ArticleNode {
    const group = this.articleGroups[id];
    const node = group.find((x) => language.languages.includes(x.frontmatter.lang)) || group[0];
    return node;
  }

  getLangPathMap(id: string): LangPathMap {
    const group = this.articleGroups[id];
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
