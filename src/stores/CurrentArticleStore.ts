import { Store } from "simstate";
import { ArticleNode } from "@/models/ArticleNode";

interface State {
  article: ArticleNode | undefined;
}

export class CurrentArticleStore extends Store<State> {

  constructor(article: ArticleNode | undefined) {
    super();
    this.state = { article };
  }

  setArticle(article: ArticleNode | undefined) {
    if (this.state.article !== article) {
      this.setState({ article });
    }
  }

}
