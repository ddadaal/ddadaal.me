import React from "react";
import styled from "styled-components";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

interface Props {
  transparentHeader: boolean;
}

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HeaderFooterLayout: React.FC<React.PropsWithChildren<Props>> = ({ transparentHeader, children }) => {
  return (
    <>
      <Header transparentHeader={transparentHeader} />
      <LayoutMain>{children}</LayoutMain>
      <Footer />
    </>
  );
};

export default HeaderFooterLayout;
