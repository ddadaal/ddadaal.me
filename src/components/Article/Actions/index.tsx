import React from "react";
import { ArticleNode } from "@/models/ArticleNode";
import LikeAction from "@/components/Article/Actions/LikeAction";
import CopyLinkAction from "@/components/Article/Actions/CopyLinkAction";
import styled from "styled-components";

interface Props {
  article: ArticleNode;
}

const ArticleActions: React.FC<Props> = ({ article }) => {
  return (
    <div >
      <ActionList>
        <LikeAction articleId={article.frontmatter.id}/>
        <CopyLinkAction articleId={article.frontmatter.id}/>
      </ActionList>
    </div>
  );
};

const ActionList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

export default ArticleActions;
