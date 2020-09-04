import React from "react";
import { Header } from "@/components/Header";
// import Footer from "@/components/Footer";
import styled from "styled-components";

interface Props {
  transparentHeader: boolean;
}

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const HeaderFooterLayout: React.FC<Props> = ({ transparentHeader, children }) => {
  return (
    <>
      <Header />
      <LayoutMain>{children}</LayoutMain>
      {/* <Footer /> */}
    </>
  );
};

export default HeaderFooterLayout;
