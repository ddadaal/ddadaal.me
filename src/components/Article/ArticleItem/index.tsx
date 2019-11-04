import React from "react";
import { Link } from "gatsby";
import I18nStore from "@/stores/I18nStore";
import MetadataStore from "@/stores/MetadataStore";
import ArticleFrontmatter from "../ArticleFrontmatter";
import { ArticleNode } from "@/models/ArticleNode";
import { useStore } from "simstate";
import containsChinese from "@/utils/containsChinese";
import "./article-item.scss";

interface Props {
  article: ArticleNode;
  currentArticleLanguage: string;
}

function limitLength(content: string): string {
  const lengthLimit = containsChinese(content) ? 130 : 300;
  return content.substring(0, lengthLimit) + "...";
}

const ArticleItem: React.FC<Props> = ({ article, currentArticleLanguage }) => {
  const { frontmatter: { id, title, tags, date }, timeToRead, excerpt } = article;

  const { language } = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  const langPaths = metadataStore.getLangPathMap(id);

  return (
    <div className="article-item">
      <Link className="article-item__header" to={langPaths.get(language.metadata.id) || langPaths.values().next().value}>
        {title}
      </Link>

      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        date={date}
        timeToRead={timeToRead}
        tags={tags}
        articleId={id}
      />

      <p className="article-item__excerpt">{limitLength(excerpt)}</p>
      <hr />
    </div>
  );
}

export default ArticleItem;
