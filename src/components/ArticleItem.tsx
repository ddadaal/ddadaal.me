import * as React from "react";
import { Link } from "gatsby";
import styled from "styled-components";
import TagGroup from "./TagGroup";
import DateDisplay from "./DateDisplay";

interface Props {
  idName: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];

}

const StyledPost = styled.div`
  margin-bottom: 32px;

  h1 {
    font-size: 3em;
  }
`;

export default function ArticleItem(props: Props) {
  const { idName, title, excerpt, date, tags } = props;

  return (
    <StyledPost>
      <Link to={`/articles/${idName}`}>
        <h1>{title}</h1>
      </Link>
      <TagGroup tags={tags}/>
      <p><DateDisplay date={date}/></p>
      <p>{excerpt}</p>
      <hr/>
    </StyledPost>
  );
}
