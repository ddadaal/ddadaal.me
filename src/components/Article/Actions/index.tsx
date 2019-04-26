import React from "react";
import { ArticleNode } from "@/models/ArticleNode";
import LikeAction from "@/components/Article/Actions/LikeAction";
import CopyLinkAction from "@/components/Article/Actions/CopyLinkAction";
import styled from "styled-components";

interface Props {
  article: ArticleNode;
}

export default function ArticleActions({ article }: Props) {
  return (
    <div >
     <ActionList>
       <LikeAction articleId={article.frontmatter.id}/>
       <CopyLinkAction articleId={article.frontmatter.id}/>
     </ActionList>
    </div>
  );
}

const ActionList = styled.ul`
  list-style: none;
  padding-left: 0;
`;
