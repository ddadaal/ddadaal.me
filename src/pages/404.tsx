import React from "react";
import { Link } from "gatsby";

import Page from "@/layouts/Page";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import { PageMetadata } from "@/components/PageMetadata";

const NotFoundPage = (): React.ReactNode => (
  <HeaderFooterLayout transparentHeader={false}>
    <PageMetadata
      title={"404"}
    />
    <Page>
      <h1>404: Page not found.</h1>
      <p>
        You have entered the void!
      </p>
      <p>
        <Link to="/">
          Go home now.
        </Link>
      </p>
    </Page>
  </HeaderFooterLayout>
);

export default NotFoundPage;
