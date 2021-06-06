import React from "react";

import { PageMetadata } from "@/components/PageMetadata";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import Page from "@/layouts/Page";
import { Helmet } from "react-helmet";
import { Localized, p } from "@/i18n";

const root = p("redirects.");

interface Props {
  pageContext: {
    id: string;
    to: string;
  };
}


const RedirectPageTemplate: React.FC<Props> = ({ pageContext }) => {
  const { to } = pageContext;

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <PageMetadata
        titleId={root("title")}
      />
      <Helmet>
        <meta httpEquiv="refresh" content={`0;URL='${to}'`} />
      </Helmet>
      <Page>
        <h1>
          <Localized id={root("title")} />
        </h1>
        <p>
          <Localized id={root("description")} /> {to}
        </p>
      </Page>
    </HeaderFooterLayout>
  );
};

export default RedirectPageTemplate;
