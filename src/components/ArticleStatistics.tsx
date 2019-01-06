import * as React from "react";
import lang from "@/i18n/lang";
import I18nString from "@/i18n/I18nString";
import styled from "styled-components";

interface Props {
  date: string;
  timeToRead: number;
  wordCount: number;
}

const root = lang.articleStatistics;

const Span = styled.span`
  margin-left: 8px;
  padding-left: 8px;
  border-left: 1px solid black;
`;

export default function ArticleStatistics(props: Props) {
  const { date, timeToRead, wordCount } = props;
  return (
    <p>
      {date}
      <Span><I18nString id={root.timeToRead} replacements={[timeToRead]} /></Span>
      <Span><I18nString id={root.wordCount} replacements={[wordCount]} /></Span>
    </p>
  )
}
