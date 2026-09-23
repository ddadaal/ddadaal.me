import Link from "next/link";
import { CommentPanelWithCurrentLanguage } from "src/components/article/CommentPanel";
import { LikeButton } from "src/components/article/LikeButton";
import { Localized } from "src/i18n";
import { formatArticleTime } from "src/utils/datetime";

import { Spark } from "./loader";
import { MarkdownSpark } from "./MarkdownSpark";

export async function SparkDetail({ spark }: { spark: Spark }) {
  const time = formatArticleTime(spark.time);

  return (
    <main className="max-w-xl mx-auto py-8 px-4">
      <Link href="/sparks" className="text-sm text-primary hover:underline">
        ← <Localized id="sparksPage.backToList" />
      </Link>
      <h1 className="text-xl font-bold mt-4 mb-6">{time}</h1>
      <div className="prose max-w-full text-base leading-relaxed mb-8">
        <MarkdownSpark content={spark.content} />
      </div>
      <div className="flex justify-center mb-8">
        <LikeButton articleId={spark.id} kind="spark" />
      </div>
      <CommentPanelWithCurrentLanguage articleId={spark.id} articleTitle={time} kind="spark" />
    </main>
  );
}
