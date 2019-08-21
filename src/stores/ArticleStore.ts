import { Store } from "simstate";
import { ArticleNode } from "@/models/ArticleNode";

interface State {
  article: ArticleNode | null;
}

export class ArticleStore extends Store<State> {

  constructor(article: ArticleNode | null) {
    super();
    this.state = { article };
  }

  setArticle(article: ArticleNode | null): void {
    if (this.state.article !== article) {
      this.setState({ article });
    }
  }

}
