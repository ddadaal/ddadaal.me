import React from "react";
import ArticleFrontmatter from "./ArticleFrontmatter";
import { BannerLayoutTitle } from "@/layouts/BannerLayout";

interface Props {
  title: string;
  id: string;
  tags: string[] | null;
  date: string;
  timeToRead: number;
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

const ArticlePageBanner: React.FC<Props> = ({ title, id, tags, date, timeToRead, currentArticleLanguage }) => {
  return (
    <>
      <BannerLayoutTitle>{title}</BannerLayoutTitle>
      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        articleId={id}
        tags={tags}
        date={date}
        timeToRead={timeToRead}
      />
    </>
  );
}

export default ArticlePageBanner;
