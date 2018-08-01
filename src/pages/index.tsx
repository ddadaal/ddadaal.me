import * as React from 'react';
import Link from 'gatsby-link';
import Page from '../components/Page'
import PostContainer from '../components/PostContainer'
import HomePageLayout from '../layouts/HomePageLayout'
import { Card, CardImg, CardText, CardBody, CardLink, CardTitle, CardSubtitle } from 'reactstrap';
import styled from 'styled-components'

interface Props {
  data: {
    allMarkdownRemark: {
      edges: {
        node: {
          excerpt: string;
          id: string;
          frontmatter: {
            title: string;
            date: string;
            path: string;
            ignored: string;
          }
        }
      }[]
    }

  }
}

const Sidebar = styled.div`
  & > * {
    margin-bottom: 8px;
  }

`

export default function Index(props: Props) {
  const { edges: posts } = props.data.allMarkdownRemark;
  return (
    <HomePageLayout>
      <div className="blog-posts">
      {posts
        .filter(post => post.node.frontmatter.title.length > 0)
        .map(({ node: post }) =>
            <PostContainer key={post.id}
                           path={post.frontmatter.path}
                           title={post.frontmatter.title}
                           excerpt={post.excerpt}
                           date={post.frontmatter.date}
            />)
      }
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
            <CardText>Majoring in Software Engineering</CardText>
            <CardLink href="https://github.com/viccrubs">GitHub</CardLink>
            <CardLink href="mailto://smallda@outlook.com">Mail to me</CardLink>
            <Link className='card-link' to="/about/me">More about me</Link>
          </CardBody>
      </Card>

      </Sidebar>
    </HomePageLayout>
  );
}
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
     filter: { frontmatter: { ignored: { ne: true }}}
      sort: { order: DESC, fields: [frontmatter___date] } 
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            path
            ignored
          }
        }
      }
    }
  }
`;
