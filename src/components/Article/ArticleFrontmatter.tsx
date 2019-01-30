import * as React from "react";
import lang from "@/i18n/lang";
import I18nString from "@/i18n/I18nString";
import styled from "styled-components";
import { Badge } from "reactstrap";
import TagGroup from "./TagGroup";

interface Props {
  date: string;
  timeToRead: number;
  wordCount: number;
  tags: string[];
}

const root = lang.articleFrontmatter;

const color = "#7f8c8d";

const Span = styled.span`
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid black;
`;

const P = styled.p`
  font-size: 0.9em;
  padding: 0px;
`;

export default function ArticleFrontmatter(props: Props) {
  const { date, timeToRead, wordCount, tags } = props;
  return (
    <P>
      {tags
        ? (
        <>
          <TagGroup tags={tags} />
          <Span>{date}</Span>
        </>
        )
        : date
      }
      <Span><I18nString id={root.timeToRead} replacements={[timeToRead]} /></Span>
      <Span><I18nString id={root.wordCount} replacements={[wordCount]} /></Span>
    </P>
  )
}
