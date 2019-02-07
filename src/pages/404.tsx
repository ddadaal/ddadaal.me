import React from "react";
import { Link } from "gatsby";

import Page from "@/layouts/components/Page";

const NotFoundPage = () => (
  <Page>
    <h1>404: Page not found.</h1>
    <p>
      You've entered the void!
    </p>
    <p>
      <Link to="/">
        Go home now.
      </Link>
    </p>
  </Page>
);

export default NotFoundPage;
