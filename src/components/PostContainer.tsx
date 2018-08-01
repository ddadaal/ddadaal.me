import * as React from 'react';
import Link from 'gatsby-link';
import styled from 'styled-components'

interface Props {
  path: string;
  title: string;
  excerpt: string;
  date: string;

}

const StyledPost = styled.div` 
  margin-bottom: 32px;
`

export default function PostContainer(props: Props) {
  const { path, title, excerpt, date } =props;
  return <StyledPost>
    <Link to={path}>
      <h1>{title}</h1>
      </Link>
    <h4>{date}</h4>
    <p>{excerpt}</p>
  </StyledPost>
}
