import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleContentPage } from "src/components/article/ArticleContentPage";
import { readArticleFromDir } from "src/data/articles";
import { createDataSource } from "src/data/data";
import { generateArticleMetadata } from "src/utils/metadata";

function articleData(dir: string) {
  return createDataSource({
    watchPath: dir,
    loader: async () => {
      return await readArticleFromDir(dir);
    },
  });
}

const dataSources = {
  me: articleData("contents/about-me"),
  project: articleData("contents/about-project"),
  odyssey: articleData("contents/odyssey"),
};

type ArticleType = keyof typeof dataSources;

// get resume article item
const getArticleItem = async (type: ArticleType) => {
  return dataSources[type]();
};

interface Props {
  params: { id: string; lang?: string[] };

}

const getLangVersion = async ({ params }: Props) => {
  if (!(params.id in dataSources)) {
    return undefined;
  }

  const articleItem = await getArticleItem(params.id as ArticleType);

  if (!articleItem) {
    return undefined;
  }

  const lang = params.lang?.[0];

  const langVersion = articleItem.langVersions.find((x) => x.lang === lang) ?? articleItem.langVersions[0];

  return { langVersion, articleItem };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const data = await getLangVersion(props);

  if (!data) {
    notFound();
  }

  return generateArticleMetadata(data.langVersion, data.articleItem.langVersions.map((x) => x.lang));
}

export default async function AboutPage({ params }: Props) {
  const data = await getLangVersion({ params });

  if (!data) {
    notFound();
  }

  return (
    <ArticleContentPage
      article={data.langVersion}
      langs={data.articleItem.langVersions.map((x) => x.lang)}
    />
  );
};

export async function generateStaticParams() {
  const params: { id: string; lang?: string[] }[] = [];

  for (const type in dataSources) {
    const data = await getArticleItem(type as ArticleType);
    if (!data) {
      throw new Error("Fail to fetch data " + type);
    }
    params.push({ id: type, lang: [] });
    data.langVersions.forEach((x) => params.push({ id: type, lang: [x.lang] }));
  }

  return params;
}
