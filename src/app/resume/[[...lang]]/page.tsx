import "./resume.css";

import { notFound } from "next/navigation";
import { ArticleContentPage } from "src/components/article/ArticleContentPage";
import { getResume } from "src/data/resume";
import { generateArticleMetadata } from "src/utils/metadata";

interface Props {
  params: Promise<{ lang?: string[] }>;
}

const getResumeOfLang = async (lang: string | undefined) => {
  const resume = await getResume();

  if (!resume) {
    return undefined;
  }

  const resumeOfLang = resume.langVersions.find((x) => x.lang === lang) ?? resume.langVersions[0];

  return { resume, resumeOfLang };
};

export const generateMetadata = async (props: Props) => {
  const params = await props.params;
  const data = await getResumeOfLang(params.lang?.[0]);

  if (!data) {
    return {};
  }

  return generateArticleMetadata(data.resumeOfLang, data.resume.langVersions.map((x) => x.lang));
};

export default async function ResumePage(props: Props) {
  const params = await props.params;
  const data = await getResumeOfLang(params.lang?.[0]);

  if (!data) {
    notFound();
  }

  return (
    <div className="resume">
      <ArticleContentPage article={data.resumeOfLang} langs={data.resume.langVersions.map((x) => x.lang)} />
    </div>
  );
};

export async function generateStaticParams() {
  // get resume
  const resume = await getResume();

  if (!resume) {
    return [];
  }

  const params: { lang: string[] }[] = [{ lang: [] }];

  params.push(...resume.langVersions.map((x) => ({ lang: [x.lang] })));

  return params;
}
