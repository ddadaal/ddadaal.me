import * as React from "react";
import Link, { push } from "gatsby-link";
import Post from "../components/Post";
import HomePageLayout from "../layouts/HomePageLayout";
import {
  Card, CardText,
  CardBody, CardLink, CardTitle, CardSubtitle, Pagination, PaginationItem, PaginationLink,
} from "reactstrap";
import styled from "styled-components";
import { ArticleNode } from "../models/ArticleNode";
import { range } from "../utils/Array";
import { FaCode, FaGithub, FaEnvelope, FaEllipsisH, FaFile } from "react-icons/fa";

interface Props {
  pageContext: {
    group: Array<{ node: ArticleNode }>;
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

const StackedDiv = styled.div`
  & > a {
  display: block;
  margin: 4px 0 !important;
  }
`;

function toPage(pageIndex: number) {
  const path = "/" + (pageIndex === 1 ? "" : pageIndex);
  return () => push(path);
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
  const { group: posts, index, pageCount } = props.pageContext;

  return (
    <HomePageLayout location={props.location}>
      <div className="blog-posts">
        {posts
          .filter((post) => post.node.frontmatter.title.length > 0)
          .map(({ node: post }) =>
            <Post key={post.id}
                  idName={post.frontmatter.id_name}
                  title={post.frontmatter.title}
                  excerpt={post.excerpt}
                  date={new Date(post.frontmatter.date)}
                  tags={post.frontmatter.tags}
            />)
        }
        <PageIndicator pageCount={pageCount} current={index}/>
      </div>
      <Sidebar>
        <Card>
          <CardBody>
            <CardTitle>VicBlog</CardTitle>
            <CardSubtitle>A Personal Blog</CardSubtitle>
          </CardBody>
          <CardBody>
            <CardText>Articles on technologies and experiences during study and practices</CardText>
            <StackedDiv>
              <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby"><FaCode/>Source Code on GitHub</CardLink>
            </StackedDiv>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>Author</CardTitle>
            <CardSubtitle>Chen Junda</CardSubtitle>
          </CardBody>
          <CardBody>
            <CardText>Undergraduate student in Nanjing University since 2016</CardText>
            <CardText>Major in Software Engineering</CardText>
            <StackedDiv>
              <Link className="card-link" to="/resume"><FaFile/>Resume</Link>
              <CardLink href="mailto://smallda@outlook.com"><FaEnvelope/>Mail to me</CardLink>
              <Link className="card-link" to="/about/me"><FaEllipsisH/>More about me</Link>
            </StackedDiv>
          </CardBody>
        </Card>

      </Sidebar>
    </HomePageLayout>
  );
}
