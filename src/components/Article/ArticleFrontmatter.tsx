import * as React from "react";
import lang from "@/i18n/lang";
import I18nString from "@/i18n/I18nString";
import styled from "styled-components";
import { Badge, Row, Col } from "reactstrap";
import TagGroup from "./TagGroup";
import { FaCalendarAlt, FaClock, FaFileWord, FaTags } from "react-icons/fa";
import { breakpoints } from "@/styles/variables";

interface Props {
  date: string;
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

const Tags = styled(Span)`
  display: inline;
  /* @media (max-width: ${breakpoints.md}px) {
    display: block;
    margin-bottom: 4px;
  } */
`;

const ContainerRow = styled.div`
  font-size: 0.9em;
  margin: 8px 0;

  vertical-align: center;
`;

export default function ArticleFrontmatter(props: Props) {
  const { date, wordCount, tags } = props;
  return (
    <ContainerRow>

      {tags && <Tags ><FaTags /><TagGroup tags={tags || []} /></Tags>}
      <Span>
        <FaCalendarAlt />
        {date}
      </Span>
      {/* <Span><FaClock /><I18nString id={root.timeToRead} replacements={[timeToRead]} /></Span>  */}
      <Span>
        <FaFileWord />
        <I18nString id={root.wordCount} replacements={[wordCount]} />
      </Span>
    </ContainerRow>
  )
}
