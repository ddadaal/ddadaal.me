import { ArticleNode } from "./ArticleNode";
import { Language } from "../i18n/definition";

export interface ArticleGroups {
  [id: string]: ArticleNode[];
}
