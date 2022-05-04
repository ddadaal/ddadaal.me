import { navigate } from "gatsby";
import React from "react";
import { CardBody } from "reactstrap";
import styled from "styled-components";

import { BaseCard } from "@/components/Cards/components";
import { useI18n } from "@/i18n";
import MetadataStore from "@/stores/MetadataStore";
import { colors } from "@/styles/variables";
import { useStore } from "~/node_modules/simstate";

interface Props {
  articleId: string;
  className?: string;
}

const Card = styled(BaseCard)`

  margin: 4px;

  max-width: 300px;
  height: 200px;

    overflow: hidden;

  .card-body {
    font-size: 14px;
    padding: 0.75rem 1rem;

  }

  :hover {
    cursor: pointer;
  }
`;

const ArticleCard: React.FC<Props> = ({ articleId, className }) => {

  const metadataStore = useStore(MetadataStore);
  const i18n = useI18n();

  const localizedArticle = metadataStore.getArticleOfLang(
    articleId, i18n.currentLanguage.id);

  return (
    <Card className={className} onClick={() => navigate(localizedArticle.path)}>
      <CardBody>
        <Date>{localizedArticle.frontmatter.date}</Date>
        <Title>{localizedArticle.frontmatter.title}</Title>
        <Content>
          {localizedArticle.excerpt}
        </Content>
      </CardBody>

    </Card>
  );
};

export default ArticleCard;

const Title = styled.p`
  margin-bottom: 2px;
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

`;

const Date = styled.p`
  margin-bottom: 2px;
  font-size: 12px;
  color: ${colors.gray};
`;

const Content = styled.p`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 6;
`;
