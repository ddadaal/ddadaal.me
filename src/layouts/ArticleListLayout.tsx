import React from "react";
import { Row, Col } from "reactstrap";
import styled from "styled-components";
import TagsCard from "@/components/Cards/TagsCard";
import Page from "@/layouts/Page";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import SearchCard from "@/components/Cards/SearchCard";
import ArticleSearchBar from "@/components/Article/SearchBar";
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

const SearchBarContainer = styled.div`
  margin: 4px 0 8px 0;
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
              </SearchBarContainer>
            </MediaQuery>
            {props.children}
          </Col>
          <Col md={4} xs={12}>
            <MediaQuery minWidth={breakpoints.md}>
              <Sidebar>
                {/* <ArticleSearchBar /> */}
                {/* <SearchBar /> */}
                <SearchCard />
                <TagsCard />
                {/*<BlogIntroCard/>*/}
                {/*<SelfIntroCard/>*/}
              </Sidebar>
            </MediaQuery>
          </Col>
        </Row>
      </Page>
    </HeaderFooterLayout>
  );
}

export default ArticleListLayout;
