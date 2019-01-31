import * as React from "react";
import lang from "@/i18n/lang";
import I18nString from "@/i18n/I18nString";
import styled from "styled-components";
import { Badge } from "reactstrap";
import TagGroup from "./TagGroup";
import { FaCalendarAlt, FaClock, FaFileWord, FaTags } from "react-icons/fa";

interface Props {
  date: string;
  timeToRead: number;
  wordCount: number;
  tags: string[];
}

const root = lang.articleFrontmatter;

const color = "#7f8c8d";

const Span = styled.span`
  margin-right: 8px;
  padding-right: 8px;
  /* border-left: 1px solid black; */
`;

const P = styled.div`
  font-size: 0.9em;
  margin: 8px 0;

  display: flex;
  align-items: center;
`;

export default function ArticleFrontmatter(props: Props) {
  const { date, timeToRead, wordCount, tags } = props;
  return (
    <P>
      { tags && <Span><FaTags /><TagGroup tags={tags || []} /></Span>}
      <Span><FaCalendarAlt />{date}</Span>
      <Span><FaClock /><I18nString id={root.timeToRead} replacements={[timeToRead]} /></Span>
      <Span><FaFileWord /><I18nString id={root.wordCount} replacements={[wordCount]} /></Span>
    </P>
  )
}
