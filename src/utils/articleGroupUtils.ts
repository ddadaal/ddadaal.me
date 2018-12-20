import { ArticleGroups } from './../models/ArticleGroups';
import { Language } from './../i18n/definition';
import { ArticleNode } from './../models/ArticleNode';

export function createLangPathMap(group: ArticleNode[]) {
  return Object.values(group).reduce((prev, curr) => ({
    ...prev,
    [curr.frontmatter.lang]: curr.path!,
  }), {});
}

export function getNodeFromLang(language: Language, id_name: string, articleGroups: ArticleGroups) {
  const group = articleGroups[id_name];
  const node = group.find((x) => language.languages.includes(x.frontmatter.lang)) || group[0];
  return node;
}

export function removeLangFromPath(path: string): string {
  let i = 0, slashCount = 0;
  while (slashCount < 2 && i<path.length) {
    if (path[i] === '/') {
      slashCount++;
    }
    i++;
  }
  return path.substring(i - 1);
}
