import React from "react";
import { Link } from "gatsby";
import MetadataStore from "@/stores/MetadataStore";
import ArticleFrontmatter from "../ArticleFrontmatter";
import { ArticleNode } from "@/models/ArticleNode";
import { useStore } from "simstate";
import containsChinese from "@/utils/containsChinese";
import "./article-item.scss";
import useConstant from "@/utils/useConstant";
import { fromArticleTime } from "@/utils/datetime";
import { useI18nStore } from "@/i18n";

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

  const { currentLanguage } = useI18nStore();
  const metadataStore = useStore(MetadataStore);

  const langPaths = metadataStore.getLangPathMap(id);

  const dateObject = useConstant(() => fromArticleTime(date));

  return (
    <div className="article-item">
      <Link className="article-item__header" to={langPaths.get(currentLanguage.id) || langPaths.values().next().value}>
        {title}
      </Link>

      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        date={dateObject}
        timeToRead={timeToRead}
        tags={tags}
        articleId={id}
        setItemProp={false}
      />

      <p className="article-item__excerpt">{limitLength(excerpt)}</p>
      <hr />
    </div>
  );
}

export default ArticleItem;
