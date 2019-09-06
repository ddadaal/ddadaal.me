import { ArticleNode } from "@/models/ArticleNode";
import { useState } from "react";

export default function ArticleStore(initialArticle: ArticleNode | null) {
  const [article, setArticle] = useState(initialArticle);

  return { article, setArticle };
}
