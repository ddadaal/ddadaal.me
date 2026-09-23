import Link from "next/link";
import { ArticleViewCount } from "src/components/article/ArticleViewCount";
import { formatArticleTime } from "src/utils/datetime";

import { ExpandableSpark } from "./ExpandableSpark";
import { loadSparks } from "./loader";
import { MarkdownSpark } from "./MarkdownSpark";

export async function SparkList() {
  const sparks = await loadSparks();
  return (
    <div className="flex flex-col gap-4">
      {sparks.map((spark) => (
        <Link key={spark.id} href={`/sparks/${spark.id}`} className="block">
          <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body p-4">
              <div className="flex-shrink-0 flex items-center justify-between text-sm text-base-content/60 font-medium">
                <span>{formatArticleTime(spark.time)}</span>
                <ArticleViewCount articleId={spark.id} />
              </div>
              <div className="flex-1 text-base leading-relaxed prose max-w-full">
                <ExpandableSpark>
                  <MarkdownSpark content={spark.content} />
                </ExpandableSpark>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
