import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { lang } from "@/i18n";
import { LocalizedString } from "simstate-i18n";
import ArticleCard from "@/components/Article/ArticleCard";
import styled from "styled-components";

interface Props {
  ids: string[];
}

const HorizontalList = styled.ul`
  margin: 24px 0;
  width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  padding-left: 0px;
`;

const RelatedCard = styled(ArticleCard)`
&& {
  display: inline-block;
  white-space: normal;
}

`;

const Container = styled.div`
  margin: 32px 0;
`;

const root = lang.articlePage.relatedArticles;

const RelatedArticles: React.FC<Props> = ({ ids }) => {
  return (
    <Container>
      <h3>
        <FaArrowRight />{" "}
        <LocalizedString id={root.text} />
      </h3>
      <HorizontalList>
        {ids.map((id) => (
          <RelatedCard articleId={id} key={id} />
        ))}
      </HorizontalList>
    </Container>
  );

}

export default RelatedArticles;
