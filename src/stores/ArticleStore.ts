import { Store } from "simstate";
import { ArticleNode } from "@/models/ArticleNode";
import { ArticleGroups } from "@/models/ArticleGroups";
import { Language } from "@/i18n/definition";
import { SiteMetadata } from "@/models/SiteMetadata";

interface IArticleStore {
  articleGroups: ArticleGroups;
  baseUrl: string;
}

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

export class ArticleStore extends Store<IArticleStore> {

  constructor(articleGroups: ArticleGroups, baseUrl: string) {
    super();
    this.state = { articleGroups, baseUrl };
  }

  getNodeFromLang(id: string, language: Language) {
    const group = this.state.articleGroups[id];
    const node = group.find((x) => language.languages.includes(x.frontmatter.lang)) || group[0];
    return node;
  }

  getLangPathMap(id: string): LangPathMap {
    const group = this.state.articleGroups[id];
    const map: LangPathMap = new Map();

    group.forEach((node) => {
      map.set(node.frontmatter.lang, node.path);
    });

    return map;
  }

}
