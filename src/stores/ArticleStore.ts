import Store from "./Store";
import { ArticleNode } from "@/models/ArticleNode";
import { ArticleGroups } from "@/models/ArticleGroups";
import { Language } from "@/i18n/definition";

interface IArticleStore {
  articleGroups: ArticleGroups;
}

export function createArticleGroups(allMarkdownRemark: { edges:  { node: ArticleNode }[] }) {
  const articleGroups = {};
  allMarkdownRemark.edges.forEach(({ node }) => {
    const id = node.frontmatter.id;
    articleGroups[id] = articleGroups[id] || [];
    node.path = `/${node.frontmatter.lang}${node.frontmatter.absolute_path || `/articles/${node.frontmatter.id}`}`;
    articleGroups[id].push(node);
  });
  return articleGroups;
}

export class ArticleStore extends Store<IArticleStore> {
  constructor(articleGroups: ArticleGroups) {
    super();

    this.state = { articleGroups };
  }

  getNodeFromLang(id: string, language: Language) {
    const group = this.state.articleGroups[id];
    const node = group.find((x) => language.languages.includes(x.frontmatter.lang)) || group[0];
    return node;
  }

  getLangPathMap(id: string): { [lang: string]: string } {
    const group = this.state.articleGroups[id];
    return Object.values(group).reduce((prev, curr) => ({
      ...prev,
      [curr.frontmatter.lang]: curr.path,
    }), {});
  }

}
