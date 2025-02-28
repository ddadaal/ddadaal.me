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
  params: Promise<{ id: string; lang?: string[] }>;

}

const getLangVersion = async ({ id, lang }: {
  id: string; lang?: string[];
}) => {
  if (!(id in dataSources)) {
    return undefined;
  }

  const articleItem = await getArticleItem(id as ArticleType);

  if (!articleItem) {
    return undefined;
  }

  const lang1 = lang?.[0];

  const langVersion = articleItem.langVersions.find((x) => x.lang === lang1) ?? articleItem.langVersions[0];

  return { langVersion, articleItem };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getLangVersion(params);

  if (!data) {
    notFound();
  }

  return generateArticleMetadata(data.langVersion, data.articleItem.langVersions.map((x) => x.lang));
}

export default async function AboutPage(props: Props) {
  const params = await props.params;
  const data = await getLangVersion(params);

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
