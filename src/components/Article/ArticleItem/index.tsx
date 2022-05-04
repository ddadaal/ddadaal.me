import "./article-item.scss";

import { Link } from "gatsby";
import React from "react";
import { useStore } from "simstate";

import { useI18n } from "@/i18n";
import { ArticleNode } from "@/models/ArticleNode";
import MetadataStore from "@/stores/MetadataStore";
import containsChinese from "@/utils/containsChinese";
import { fromArticleTime } from "@/utils/datetime";
import useConstant from "@/utils/useConstant";

import ArticleFrontmatter from "../ArticleFrontmatter";

interface Props {
  article: ArticleNode;
  currentArticleLanguage: string;
}

function limitLength(content: string): string {
  const lengthLimit = containsChinese(content) ? 130 : 300;
  return content.substring(0, lengthLimit) + "...";
}

const ArticleItem: React.FC<Props> = ({ article, currentArticleLanguage }) => {
  const {
    frontmatter: { id, title, tags, date, last_updated },
    timeToRead, wordCountChinese, excerpt,
  } = article;

  const { currentLanguage } = useI18n();
  const metadataStore = useStore(MetadataStore);

  const langPaths = metadataStore.getLangPathMap(id);

  const dateObject = useConstant(() => fromArticleTime(date));
  const lastUpdatedObject = useConstant(() =>
    last_updated
      ? fromArticleTime(last_updated)
      : undefined);

  return (
    <div className="article-item">
      <Link
        className="article-item__header"
        to={langPaths.get(currentLanguage.id) || langPaths.values().next().value}
      >
        {title}
      </Link>
      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        date={dateObject}
        lastUpdated={lastUpdatedObject}
        timeToRead={timeToRead}
        tags={tags}
        articleId={id}
        wordCount={wordCountChinese}
        setItemProp={false}
      />

      <p className="article-item__excerpt">{limitLength(excerpt)}</p>
      <hr />
    </div>
  );
};

export default ArticleItem;
