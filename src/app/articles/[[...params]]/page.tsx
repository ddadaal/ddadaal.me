import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleList } from "src/app/articles/[[...params]]/ArticleList";
import { ArticleListPageLayout } from "src/app/articles/ArticleListPageLayout";
import { countTags } from "src/app/articles/tags";
import { ArticleContentPage } from "src/components/article/ArticleContentPage";
import { convertToListInfo, readArticlesCached } from "src/data/articles";
import { generateTitle } from "src/utils/metadata";

interface Props {
  params: {
    params: string[] | undefined;
  };
}

const PAGE_SIZE = 5;

const switchParams = (params?: string[]) => {

  if (!params || (params.length === 1 && !isNaN(Number(params[0])))) {
    return { type: "list", pageNumber: !params ? 1 : Number(params[0]) } as const;
  }

  if (params.length === 1) {
    return { type: "article", articleId: params[0] } as const;
  }

  if (params.length === 2) {
    return { type: "articleOfLang", articleId: params[0], lang: params[1] } as const;
  }

  return { type: "unknown" } as const;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = switchParams(params?.params);

  if (result.type === "unknown") { return {}; }

  if (result.type === "list") {
    return {
      title: generateTitle("Articles"),
    };
  }

  const articles = await readArticlesCached();
  const article = articles.find((x) => x.id === result.articleId);

  if (!article) { return {}; }

  if (result.type === "article") {
    return {
      title: generateTitle(article.langVersions[0].title),
    };
  }

  if (result.type === "articleOfLang") {

    const langVersion = article.langVersions.find((x) => x.lang === result.lang)
      ?? article.langVersions[0];

    return {
      title: generateTitle(langVersion.title),
    };
  }

  return {};
}

export default async function ArticlePage({
  params: { params },
}: Props) {

  const paramsResult = switchParams(params);

  const articles = await readArticlesCached();

  // if params is empty or of number, it's list page
  if (paramsResult.type === "list") {

    const { pageNumber } = paramsResult;

    const articlesOfPage = articles.slice(
      (pageNumber - 1) * PAGE_SIZE,
      pageNumber * PAGE_SIZE,
    );

    // count tags
    const tagCounts = countTags(articles);

    // shorten article content
    const pageArticleListInfo = articlesOfPage.map(convertToListInfo);

    const totalPages = Math.ceil(articles.length / PAGE_SIZE);

    return (
      <ArticleListPageLayout tagCounts={tagCounts} articleCount={articles.length}>
        <ArticleList
          pageNum={pageNumber}
          totalPages={totalPages}
          articles={pageArticleListInfo}
          articleCount={articles.length}
          tagCounts={tagCounts}
        />
      </ArticleListPageLayout>
    );
  }

  // if params is of length 1, it's article page of default language
  if (paramsResult.type === "article") {
    const articleItem = articles.find((a) => a.id === paramsResult.articleId);

    if (!articleItem) {
      notFound();
    }

    const article = articleItem.langVersions[0];

    return (
      <ArticleContentPage article={article} langs={articleItem.langVersions.map((x) => x.lang)} />
    );
  }

  // if params is of length 2, it's article page of the specific language
  if (paramsResult.type === "articleOfLang") {
    const articleItem = articles.find((a) => a.id === paramsResult.articleId);

    if (!articleItem) {
      notFound();
    }

    const article = articleItem.langVersions.find((x) => x.lang === paramsResult.lang);

    if (!article) {
      notFound();
    }

    return (
      <ArticleContentPage article={article} langs={articleItem.langVersions.map((x) => x.lang)} />
    );
  }

  notFound();

}


export async function generateStaticParams() {
  const articles = await readArticlesCached();

  const params: string[][] = [[]];

  // generate list page params
  const pageCount = Math.ceil(articles.length / PAGE_SIZE);

  params.push(...Array.from({ length: pageCount }).map((_, i) => [String(i + 1)]));

  for (const article of articles) {
    // default article
    params.push([article.id]);

    // all langs
    for (const version of article.langVersions) {
      params.push([article.id, version.lang]);
    }
  }

  return params.map((x) => ({ params: x }));


}
