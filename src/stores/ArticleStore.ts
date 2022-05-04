import { useState } from "react";

import { ArticleNode } from "@/models/ArticleNode";

export default function ArticleStore(initialArticle: ArticleNode | null) {
  const [article, setArticle] = useState(initialArticle);

  return { article, setArticle };
}
