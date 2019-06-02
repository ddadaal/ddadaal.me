import React from "react";
import { Row, Col } from "reactstrap";
import BlogIntroCard from "@/components/Cards/BlogIntroCard";
import SelfIntroCard from "@/components/Cards/SelfIntroCard";
import StatisticsCard from "@/components/Cards/StatisticsCard";
import styled from "styled-components";
import TagsCard from "@/components/Cards/TagsCard";
import FriendsCard from "@/components/Cards/FriendsCard";
import Page from "@/layouts/Page";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import SearchCard from "@/components/Cards/SearchCard";
import ArticleSearch from "@/components/Article/Search";
import MediaQuery from "react-responsive";
import { breakpoints } from "@/styles/variables";
// import SearchBar from "@/components/SearchBar";

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
    <HeaderFooterLayout transparentHeader={false}>
      <Page>
        <Row>
          <Col md={3} xs={12}>
            <Sidebar>
              <ArticleSearch />
              {/* <SearchBar /> */}
              {/* <SearchCard /> */}
              <MediaQuery minWidth={breakpoints.md}>
                <TagsCard />
              </MediaQuery>

              {/*<BlogIntroCard/>*/}
              {/*<SelfIntroCard/>*/}
            </Sidebar>
          </Col>
          <Col md={9} xs={12}>
            {props.children}
          </Col>
        </Row>
      </Page>
    </HeaderFooterLayout>
  );
}
