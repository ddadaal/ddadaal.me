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

  tagMap = new Map<string, { [lang: string]: string }>();

  constructor(
    public statistics: Statistics,
    public articleGroups: ArticleGroups,
    public baseUrl: string,
    tags: Tag[]
  ) {
    super();

    // init tag map
    tags.forEach(({ tag, ...variations }) => {
      this.tagMap.set(tag, variations as any);
    });
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
    const variations = this.tagMap.get(tag);

    if (!variations) {
      return null;
    }

    return variations[language.id] || null;

  }

  getAllVariationsOfTag(tag: string): string[] {
    const variations = [tag];
    Object.values(this.tagMap.get(tag) || {}).forEach((variation) => {
      variations.push(variation);
    });

    return variations;
  }

}
