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
import { I18nConsumer } from "../i18n/I18nContext";
import { ArticleGroups } from "../models/ArticleGroups";
import { createLangPathMap, getNodeFromLang } from "../utils/articleGroupUtils";


interface Props {
  pageContext: {
    index: number;
    pageCount: number;
    items: ArticleNode[];
    articleGroups: ArticleGroups;
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
        <PaginationLink disabled={current === 1} previous={true} onClick={toPage(current - 1)} />
      </PaginationItem>
      {range(1, pageCount + 1).map((x) =>
        <PaginationItem active={current === x} key={x}>
          <PaginationLink onClick={toPage(x)}>
            {x}
          </PaginationLink>
        </PaginationItem>)}
      <PaginationItem>
        <PaginationLink disabled={current === pageCount} next={true} onClick={toPage(current + 1)} />
      </PaginationItem>
    </Pagination>
  );
}

export default function Index(props: Props) {
  const { pageCount, index, articleGroups, items } = props.pageContext;
  return (
    <HomePageLayout location={props.location} articleGroups={articleGroups}>
      <div className="blog-posts">
        {items
          .filter((node) => node.frontmatter.title.length > 0)
          .map((node) => {
            return (
              <I18nConsumer key={node.id}>
                {({ language }) => {
                  const group = articleGroups[node.frontmatter.id_name];
                  const postInThisLanguage = getNodeFromLang(language, node.frontmatter.id_name, articleGroups);
                  const langPaths = createLangPathMap(group);
                  return (
                    <ArticleItem
                      key={postInThisLanguage.id}
                      idName={postInThisLanguage.frontmatter.id_name}
                      title={postInThisLanguage.frontmatter.title}
                      excerpt={postInThisLanguage.excerpt}
                      date={postInThisLanguage.frontmatter.date}
                      tags={postInThisLanguage.frontmatter.tags}
                      langPaths={langPaths}
                    />
                  );
                }}
              </I18nConsumer>
            );
          })
        }
        <PageIndicator pageCount={pageCount} current={index} />
      </div>
      <Sidebar>
        <BlogIntroCard articleGroups={articleGroups}/>
        <SelfIntroCard articleGroups={articleGroups} />
      </Sidebar>
    </HomePageLayout>
  );
}
