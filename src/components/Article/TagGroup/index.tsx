import React from "react";
import ArticleTag from "@/components/Article/TagGroup/ArticleTag";

interface Props {
  className?: string;
  tags: string[];
  containsCount?: boolean;
}

export default function ArticleTagGroup({ tags, containsCount }: Props) {

  return (
    <>
      {
        tags.map((tag) => (
          <ArticleTag
            key={tag}
            tag={tag}
            containsCount={containsCount}
          />
        ))
      }
    </>
  );

}
