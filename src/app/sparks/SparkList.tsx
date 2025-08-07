import { formatDateTime, fromArticleTime } from "src/utils/datetime";

import { loadSparks } from "./loader";
import { MarkdownSpark } from "./MarkdownSpark";

export async function SparkList() {
  const sparks = await loadSparks();
  return (
    <div className="flex flex-col gap-4">
      {sparks.map((spark, idx) => (
        <div key={idx} className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex-shrink-0">
              <span className="text-sm text-base-content/60 font-medium">
                {formatDateTime(fromArticleTime(spark.time))}
              </span>
            </div>
            <div className="flex-1 text-base leading-relaxed">
              <MarkdownSpark content={spark.content} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
