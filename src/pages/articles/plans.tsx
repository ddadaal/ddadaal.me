import React from "react";
import { graphql } from "gatsby";
import { ArticlePlan } from "@/models/ArticlePlan";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import Page from "@/layouts/components/Page";

interface Props {
  data: {
    allPlansJson: {
      edges: { node: ArticlePlan }[],
    },
  };
}

const root = lang.articlePlans;

export default function ArticlePlansPage(props: Props) {
  const { data: { allPlansJson: { edges }} } = props;
  const plans = edges.map((x) => x.node);

  return (
    <Page>
      <h1><LocalizedString id={root.title} /></h1>
      <p><LocalizedString id={root.description} /></p>
      <hr/>
      {plans.map((plan) => {
        return (
          <div key={plan.id}>
            <h3>{plan.title}</h3>
          </div>
        );
      })}
    </Page>
  );

}

export const query = graphql`
  query articlePlansQuery {
    allPlansJson {
      edges {
        node {
          id
          title
          tags
          startTime
          deadline
          pageExists
        }
      }
    }
  }
`;
