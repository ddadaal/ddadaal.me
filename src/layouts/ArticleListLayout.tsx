import * as React from "react";
import { Row, Col } from "reactstrap";
import ArticleItemList from "@/components/Article/ArticleItemList";
import BlogIntroCard from "@/components/Cards/BlogIntroCard";
import SelfIntroCard from "@/components/Cards/SelfIntroCard";
import StatisticsCard from "@/components/Cards/StatisticsCard";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const Sidebar = styled.div`
  & > * {
    margin-bottom: 8px;
  }

`;

export default function ArticleListLayout(props: Props) {
  return (
    <Row>
      <Col md={8} xs={12}>
        {props.children}
      </Col>
      <Col md={4} xs={12}>
        <Sidebar>
          <BlogIntroCard />
          <SelfIntroCard />
          <StatisticsCard />
        </Sidebar>
      </Col>
    </Row>
  );
}
