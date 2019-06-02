import React from "react";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import { useStore } from "~/node_modules/simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import styled from "styled-components";
import { CardBody } from "reactstrap";
import { navigate } from "gatsby";
import { containsChinese } from "@/utils/containsChinese";
import { colors } from "@/styles/variables";

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

export default function ArticleCard({ articleId, className }: Props) {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  const localizedArticle = metadataStore.getArticleOfLang(articleId, i18nStore.language);

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
}

function limitLength(content: string) {
  const lengthLimit = containsChinese(content) ? 100 : 200;
  return content.substring(0, lengthLimit) + "...";
}

const Title = styled.p`
  margin-bottom: 2px;
  font-weight: bold;
  font-size: 18px;
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
