import * as React from "react";
import ArticleItem from "@/components/Article/ArticleItem";
import styled from "styled-components";
import BlogIntroCard from "@/components/Cards/BlogIntroCard";
import SelfIntroCard from "@/components/Cards/SelfIntroCard";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { ArticleStore } from "@/stores/ArticleStore";
import Page from "@/layouts/components/Page";
import { Row, Col } from "reactstrap";
import StatisticsCard from "@/components/Cards/StatisticsCard";
import Helmet from "react-helmet";
import PageIndicator from "@/components/PageIndicator";
import FriendsCard from "@/components/Cards/FriendsCard";


interface Props extends WithStoresProps {
  pageContext: {
    index: number;
    pageCount: number;
    ids: string[];
  };
}

const Sidebar = styled.div`
  & > * {
    margin-bottom: 8px;
  }

`;

export default withStores(I18nStore, ArticleStore)(function Index(props: Props) {
  const { pageCount, index, ids } = props.pageContext;
  const { language, allLanguages } = props.useStore(I18nStore);
  const articleStore = props.useStore(ArticleStore);

  const items = ids.map((id) => {
    return articleStore.state.articleGroups[id];
  });

  return (
    <Page>
      <Helmet meta={[
        { name: "og:title", content: "VicBlog" },
        { name: "og:url", content: articleStore.state.baseUrl },
        { name: "og:site_name", content: "VicBlog" },
        { name: "og:locale", content: language.detailedId },
        ...allLanguages
          .filter((x) => x !== language)
          .map((x) => ({
            name: "og:locale:alternate",
            content: x.detailedId
          }))
      ]} />
      <Row>
        <Col md={8} xs={12}>
          <div className="blog-posts">
            {items
              .map((nodes) => {
                const node = articleStore.getNodeFromLang(nodes[0].frontmatter.id, language);
                return (
                  <ArticleItem article={node} key={node.frontmatter.id}/>
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
            <FriendsCard />
            <StatisticsCard />
          </Sidebar>
        </Col>
      </Row>
    </Page>
  );
});
