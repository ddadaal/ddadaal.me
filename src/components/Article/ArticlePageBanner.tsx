import { colors, heights } from "@/styles/variables";
import React from "react";
import styled from "styled-components";
import ArticleFrontmatter from "./ArticleFrontmatter";
import {
  InnerContainer as BaseInnerContainer,
} from "@/layouts/LayeredLayout";
import BannerLayout from "@/layouts/BannerLayout";

interface Props {
  title: string;
  id: string;
  tags: string[] | null;
  date: string;
  wordCount: number;
  currentArticleLanguage: string;
}

const InnerContainer = styled(BaseInnerContainer)`
  height: ${heights.banner}px;
  width: 100%;
`;

const ImgContainer = styled(InnerContainer)`
  width: 100%;

  & > img {
    float: right;
    height: ${heights.banner}px;

  }

  z-index: 1;
`;

export default function ArticlePageBanner(props: Props) {

  const { title, id, tags, date, wordCount, currentArticleLanguage } = props;

  return (
    <>
      <BannerLayout.Title>{title}</BannerLayout.Title>
      <ArticleFrontmatter
        currentArticleLanguage={currentArticleLanguage}
        articleId={id}
        tags={tags}
        date={date}
        wordCount={wordCount}
      />
    </>
  );
}
