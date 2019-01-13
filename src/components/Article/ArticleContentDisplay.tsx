import * as React from "react";
import styled from "styled-components";

interface Props {
  html: string;
}

const MarkdownDisplay = styled.div`

  /* h1, h2, h3, h4, h5, h6 {
    margin: 8px 0;
    padding-bottom: 0.3em;
    border-bottom: 1px solid;
  }

  h1 {
    font-size: 2em;
    margin: 12px 0;

  }

  h2 {
    font-size: 1.8em;
  }

  h3 {
    font-size: 1.6em;
  }
  */
`;

export default function ArticleContentDisplay(props: Props) {
  return (
    <MarkdownDisplay className="markdown"  dangerouslySetInnerHTML={{ __html: props.html }} />
  )
}
