import { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatArticleTime } from "src/utils/datetime";
import { generateTitle } from "src/utils/metadata";

import { loadSparks } from "../loader";
import { SparkDetail } from "../SparkDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const sparks = await loadSparks();
  const spark = sparks.find((x) => x.id === id);

  if (!spark) {
    return {};
  }

  return {
    title: generateTitle(`Spark ${formatArticleTime(spark.time)}`),
  };
}

export default async function SparkPage({ params }: Props) {
  const { id } = await params;
  const sparks = await loadSparks();
  const spark = sparks.find((x) => x.id === id);

  if (!spark) {
    notFound();
  }

  return <SparkDetail spark={spark} />;
}

export async function generateStaticParams() {
  const sparks = await loadSparks();
  return sparks.map((spark) => ({ id: spark.id }));
}
