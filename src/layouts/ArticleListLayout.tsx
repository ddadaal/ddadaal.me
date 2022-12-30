import React from "react";
import MediaQuery from "react-responsive";
import { Col, Row } from "reactstrap";
import styled from "styled-components";

import ArticleSearchBar from "@/components/Article/SearchBar";
import BlogIntroCard from "@/components/Cards/BlogIntroCard";
import SearchCard from "@/components/Cards/SearchCard";
import TagsCard from "@/components/Cards/TagsCard";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import Page from "@/layouts/Page";
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

const SearchBarContainer = styled.div`
  margin: 4px 0 0px 0;
`;


const ArticleListLayout: React.FC<Props> = (props: Props) => {
  return (
    <HeaderFooterLayout transparentHeader={false}>
      <Page>
        <Row>
          <Col md={8} xs={12}>
            <MediaQuery maxWidth={breakpoints.md}>
              <SearchBarContainer>
                <ArticleSearchBar />
                <hr />
              </SearchBarContainer>
            </MediaQuery>
            {props.children}
          </Col>
          <Col md={4} xs={12}>
            <MediaQuery minWidth={breakpoints.md}>
              <Sidebar>
                {/* <ArticleSearchBar /> */}
                {/* <SearchBar /> */}
                <BlogIntroCard />
                <SearchCard />
                <TagsCard />
                {/* <SelfIntroCard/>*/}
              </Sidebar>
            </MediaQuery>
          </Col>
        </Row>
      </Page>
    </HeaderFooterLayout>
  );
};

export default ArticleListLayout;
