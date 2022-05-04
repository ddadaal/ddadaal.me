import React from "react";
import { FaArrowRight } from "react-icons/fa";
import styled from "styled-components";

import ArticleCard from "@/components/Article/ArticleCard";
import { Localized } from "@/i18n";

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

const RelatedArticles: React.FC<Props> = ({ ids }) => {
  return (
    <Container>
      <h3>
        <FaArrowRight />{" "}
        <Localized id={"articlePage.relatedArticles.text"} />
      </h3>
      <HorizontalList>
        {ids.map((id) => (
          <RelatedCard articleId={id} key={id} />
        ))}
      </HorizontalList>
    </Container>
  );

};

export default RelatedArticles;
