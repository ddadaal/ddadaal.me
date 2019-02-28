import { colors, heights } from "@/styles/variables";
import React from "react";
import styled from "styled-components";
import ArticleFrontmatter from "./ArticleFrontmatter";

interface Props {
  title: string;
  id: string;
  tags: string[] | null;
  date: string;
  wordCount: number;
  currentArticleLanguage: string;
}

const RootContainer = styled.div`
  position: relative;
  height: ${heights.articleHeader}px;
  width: 100%;
  background-color: ${colors.headerBg};
`;

const InnerContainer = styled.div`
  position: absolute;
  height: ${heights.articleHeader}px;
  width: 100%;
`;

const ArticleHeader = styled.div`
  text-align: center;
  color: white;
  padding: 0px 8px 8px 8px;
`;

const InfoLayer = styled(InnerContainer)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImgContainer = styled(InnerContainer)`
  width: 100%;

  & > img {
    float: right;
    height: ${heights.articleHeader}px;

  }

  z-index: 1;
`;

const Title = styled.h1`
  font-size: 2em;
  padding: 4px 0;
`;

export default function ArticlePageHeader(props: Props) {

  const { title, id, tags, date, wordCount, currentArticleLanguage } = props;

  return (
    <RootContainer>
      {/* <ImgContainer>
        <img src={Bg} />
      </ImgContainer> */}
      <InfoLayer>
        <ArticleHeader>
          <Title>{title}</Title>
          <ArticleFrontmatter
            currentArticleLanguage={currentArticleLanguage}
            articleId={id}
            tags={tags}
            date={date}
            wordCount={wordCount}
          />
        </ArticleHeader>
      </InfoLayer>

    </RootContainer>

  );

}
