import * as React from "react";
import { navigate } from "gatsby";
import ArticleItem from "@/components/ArticleItem";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import styled from "styled-components";
import { ArticleNode } from "@/models/ArticleNode";
import { range } from "@/utils/Array";
import BlogIntroCard from "@/components/BlogIntroCard";
import SelfIntroCard from "@/components/SelfIntroCard";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import Page from "@/layouts/components/Page";
import { Row, Col } from "reactstrap";


interface Props extends WithStoresProps {
  pageContext: {
    index: number;
    pageCount: number;
    items: ArticleNode[];
  };
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
        </PaginationItem>
      )}
      <PaginationItem>
        <PaginationLink disabled={current === pageCount} next={true} onClick={toPage(current + 1)} />
      </PaginationItem>
    </Pagination>
  );
}

export default withStores(I18nStore, ArticleStore)(function Index(props: Props) {
  const { pageCount, index, items } = props.pageContext;
  const { language } = props.useStore(I18nStore);
  const articleStore = props.useStore(ArticleStore);
  return (
    <Page>
      <Row>
        <Col md={8} xs={12}>
          <div className="blog-posts">
            {items
              .filter((node) => node.frontmatter.title.length > 0)
              .map((node) => {
                const postInThisLanguage = articleStore.getNodeFromLang(node.frontmatter.id, language);
                return (
                  <ArticleItem
                    key={postInThisLanguage.id}
                    id={postInThisLanguage.frontmatter.id}
                    title={postInThisLanguage.frontmatter.title}
                    excerpt={postInThisLanguage.excerpt}
                    date={postInThisLanguage.frontmatter.date}
                    tags={postInThisLanguage.frontmatter.tags}
                  />
                );

              })
            }
            <PageIndicator pageCount={pageCount} current={index} />
          </div>
        </Col>
        <Col md={4} xs={12}>
          <Sidebar>
            <BlogIntroCard />
            <SelfIntroCard />
          </Sidebar>
        </Col>
      </Row>
    </Page>
  );
});
