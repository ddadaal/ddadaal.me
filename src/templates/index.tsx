import * as React from "react";
import Link, {push} from "gatsby-link";
import Post from "../components/Post";
import HomePageLayout from "../layouts/HomePageLayout";
import { Card, CardText, 
  CardBody, CardLink, CardTitle, CardSubtitle, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styled from "styled-components";
import { ArticleNode } from "../models/ArticleNode";
import { range } from "../utils/Array";

interface Props {
  pageContext: {
    group: Array<{ node: ArticleNode }>;
    index: number;
    pageCount: number;
  };
}

const Sidebar = styled.div`
  & > * {
    margin-bottom: 8px;
  }

`;

function toPage(pageIndex: number) {
  const path = "/" + (pageIndex === 1 ? "" : pageIndex);
  return () => push(path);
}

function PageIndicator(props: {pageCount: number, current: number}) {
  const { pageCount, current } = props;
  return <Pagination aria-label="Page">
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
  </Pagination>;
}

export default function Index(props: Props) {
  const { group: posts, index, pageCount } = props.pageContext;

  return (
    <HomePageLayout>
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
            <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby">Source Code on GitHub</CardLink>
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
            <CardLink target="__blank" href="https://github.com/viccrubs">GitHub</CardLink>
            <CardLink href="mailto://smallda@outlook.com">Mail to me</CardLink>
            <Link className="card-link" to="/about/me">More about me</Link>
          </CardBody>
      </Card>

      </Sidebar>
    </HomePageLayout>
  );
}
// export const pageQuery = graphql`
//   query IndexQuery {
//     allMarkdownRemark(
//      filter: { frontmatter: { ignored: { ne: true }}}
//       sort: { order: DESC, fields: [frontmatter___date] }
//     ) {
//       edges {
//         node {
//           excerpt(pruneLength: 250)
//           id
//           frontmatter {
//             title
//             date(formatString: "YYYY/MM/DD")
//             id_name
//             ignored
//             tags
//           }
//         }
//       }
//     }
//   }
// `;
