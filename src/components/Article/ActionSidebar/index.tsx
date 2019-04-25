import React from "react";
import styled from "styled-components";
import { colors, heights } from "@/styles/variables";
import { ArticleNode } from "@/models/ArticleNode";
import { FaThumbsUp, FaLink } from "react-icons/fa";
import Action from "@/components/Article/ActionSidebar/Action";
import lang from "@/i18n/lang";
import CopyLinkAction from "@/components/Article/ActionSidebar/CopyLinkAction";
import ThumbUpAction from "@/components/Article/ActionSidebar/ThumbUpAction";

interface Props {
  article: ArticleNode;
}

const root = lang.articlePage.actionSidebar;

export default function ArticleActionSidebar({ article }: Props) {

  return (
    <Container>
      <ActionList>
       <ThumbUpAction articleId={article.frontmatter.id}/>
        <CopyLinkAction articleId={article.frontmatter.id}/>
      </ActionList>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  top: ${heights.header + 32}px;
`;

const ActionList = styled.ul`
  list-style-type: none;
 
`;
