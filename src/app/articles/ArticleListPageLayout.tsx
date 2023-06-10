import { PropsWithChildren } from "react";

import { SearchCard, TagsCard, WebsiteCard } from "./cards";

interface Props {
  articleCount: number;

  tagCounts: { tag: string; count: number}[];
}

export const ArticleListPageLayout = ({
  children, articleCount, tagCounts,
}: PropsWithChildren<Props>) => {

  return (
    <div className="max-w-7xl mx-auto px-4 animate-slide-up">
      <div className="flex flex-row gap-2">
        <div className="lg:basis-2/3 py-4">
          {children}
        </div>
        <div className="hidden lg:block lg:basis-1/3 space-y-4 py-4">
          <WebsiteCard />
          <SearchCard showTags={false} articleCount={articleCount} tagCounts={tagCounts} />
          <TagsCard tagCounts={tagCounts} />
        </div>
      </div>
    </div>
  );

};
