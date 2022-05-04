import { DateTime } from "luxon";
import React from "react";

import { BannerLayoutTitle } from "@/layouts/BannerLayout";

import ArticleFrontmatter from "./ArticleFrontmatter";

interface Props {
  title: string;
  id: string;
  tags: string[] | null;
  date: DateTime;
  lastUpdated?: DateTime;
  timeToRead: number;
  wordCount: number;
  currentArticleLanguage: string;
}

// const InnerContainer = styled(BaseInnerContainer)`
//   height: ${heights.banner}px;
//   width: 100%;
// `;

// const ImgContainer = styled(InnerContainer)`
//   width: 100%;

//   & > img {
//     float: right;
//     height: ${heights.banner}px;

//   }

//   z-index: 1;
// `;

const ArticlePageBanner: React.FC<Props> = ({
  title, id, tags, date, lastUpdated,
  timeToRead, currentArticleLanguage, wordCount,
}) => {
  return (
    <>
      <BannerLayoutTitle>{title}</BannerLayoutTitle>
      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        articleId={id}
        tags={tags}
        date={date}
        lastUpdated={lastUpdated}
        timeToRead={timeToRead}
        wordCount={wordCount}
        setItemProp={true}
      />
    </>
  );
};

export default ArticlePageBanner;
