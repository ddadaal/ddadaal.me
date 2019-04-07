import React from "react";
import ArticleTag from "@/components/Article/TagGroup/ArticleTag";

interface Props {
  className?: string;
  tags: string[];
}

export default function ArticleTagGroup(props: Props) {

  return (
    <>
      {
        props.tags.map((tag) => <ArticleTag key={tag} tag={tag} />)
      }
    </>
  );

}
