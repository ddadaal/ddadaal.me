import * as React from "react";
import Link from "gatsby-link";
import styled from "styled-components";
import TagGroup from "./TagGroup";
import Container from "./Container";

interface Props {
  idName: string;
  title: string;
  excerpt: string;
  date: Date;
  tags: string[];

}

const StyledPost = styled.div` 
  margin-bottom: 32px;
`;

export default function Post(props: Props) {
  const { idName, title, excerpt, date, tags } = props;

  return <StyledPost>
    <Link to={`/articles/${idName}`}>
      <h1>{title}</h1>
      </Link>
    <TagGroup tags={tags}/>
    <p>{date.toLocaleString()}</p>
    <p>{excerpt}</p>
    <hr/>
  </StyledPost>;
}
