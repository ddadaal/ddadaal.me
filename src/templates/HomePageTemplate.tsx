import * as React from "react";
import { graphql, navigate } from "gatsby";
import ArticleItem from "../components/ArticleItem";
import HomePageLayout from "../layouts/HomePageLayout";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styled from "styled-components";
import { ArticleNode } from "../models/ArticleNode";
import { range } from "../utils/Array";
import BlogIntroCard from "../components/BlogIntroCard";
import SelfIntroCard from "../components/SelfIntroCard";

interface Props {
  data: {
    allMarkdownRemark: {
      edges: Array<{
        node: ArticleNode,
      }>,
    },
  };
  pageContext: {
    index: number;
    pageCount: number;
  };
  location: Location;
}

const Sidebar = styled.div`
  & > * {
    margin-bottom: 8px;
  }

`;

function toPage(pageIndex: number) {
  const path = "/" + (pageIndex === 1 ? "" : pageIndex);
  return () => navigate(path);
}

function PageIndicator(props: { pageCount: number, current: number }) {
  const { pageCount, current } = props;
  return (
    <Pagination aria-label="Page">
      <PaginationItem>
        <PaginationLink disabled={current === 1} previous={true} onClick={toPage(current - 1)}/>
      </PaginationItem>
      {range(1, pageCount + 1).map((x) =>
        <PaginationItem active={current === x} key={x}>
          <PaginationLink onClick={toPage(x)}>
            {x}
          </PaginationLink>
        </PaginationItem>)}
      <PaginationItem>
        <PaginationLink disabled={current === pageCount} next={true} onClick={toPage(current + 1)}/>
      </PaginationItem>
    </Pagination>
  );
}

export default function Index(props: Props) {
  const { pageCount, index } = props.pageContext;

  return (
    <HomePageLayout location={props.location}>
      <div className="blog-posts">
        {props.data.allMarkdownRemark.edges
          .filter((post) => post.node.frontmatter.title.length > 0)
          .map(({node: post}) =>
            <ArticleItem key={post.id}
                         idName={post.frontmatter.id_name}
                         title={post.frontmatter.title}
                         excerpt={post.excerpt}
                         date={post.frontmatter.date}
                         tags={post.frontmatter.tags}
            />)
        }
        <PageIndicator pageCount={pageCount} current={index}/>
      </div>
      <Sidebar>
        <BlogIntroCard/>
        <SelfIntroCard/>
      </Sidebar>
    </HomePageLayout>
  );
}

export const query = graphql`
  query homepageQuery(
    $skip: Int!
    $limit: Int!
  ) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: { frontmatter: { ignored: { ne: true } } } 
    ) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            date
            id_name
            title
            tags
            hide_heading
            ignored
          }
        }
      }
    }
  }
`
