import { CommentPanelWithCurrentLanguage } from "src/components/article/CommentPanel";
import { RelatedArticle, RelatedArticles } from "src/components/article/RelatedArticles";
import { Heading } from "src/components/Heading";
import { Article, readArticlesCached } from "src/data/articles";
import { formatDateTime, fromArticleTime } from "src/utils/datetime";

import { ArticleContent } from "./ArticleContent";
import { ArticleFrontmatter } from "./ArticleFrontmatter";

interface Props {
  article: Article;
  langs: string[];
}

export const ArticleContentPage = async ({ article, langs }: Props) => {

  const articles = await readArticlesCached();

  // find related article items from article
  const relatedArticleItems = articles.filter((x) => article.related?.includes(x.id));

  // create related articles
  const relatedArticles = relatedArticleItems.map((x) => ({
    id: x.id,
    langVersions: x.langVersions.map((x) => ({
      excerpt: x.content.substring(0, 100),
      lang: x.lang,
      time: formatDateTime(fromArticleTime(x.date)),
      title: x.title,
      last_updated: x.last_updated ? formatDateTime(fromArticleTime(x.last_updated)) : undefined,
      absolute_path: x.absolute_path,
    })),
  }) satisfies RelatedArticle);

  return (
    <article>
      {
        article.hide_heading ? undefined : (
          <Heading>
            <h1 className="text-4xl my-2">
              {article.title}
            </h1>
            <ArticleFrontmatter
              className="justify-center"
              articleId={article.id}
              info={article}
              langVersions={langs}
            />
          </Heading>
        )
      }
      <div className="animate-slide-up">
        <div className="max-w-7xl mx-auto p-4">
          <ArticleContent article={article} />
        </div>
        <div className="max-w-7xl mx-auto p-4">
          <RelatedArticles relatedArticles={relatedArticles} />
        </div>
        <div className="max-w-7xl mx-auto p-4">
          <CommentPanelWithCurrentLanguage articleId={article.id} articleTitle={article.title} />
        </div>
      </div>
    </article>
  );
};
