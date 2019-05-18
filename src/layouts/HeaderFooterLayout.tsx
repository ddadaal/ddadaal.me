import React, { PropsWithChildren } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styled from "styled-components";
import Navbar from "@/components/Header/Navbar";

interface Props {
  transparentHeader: boolean;
}

const LayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export default function HeaderFooterLayout(props: PropsWithChildren<Props>) {
  return (
    <>
      <Navbar transparentHeader={props.transparentHeader} />
      <LayoutMain>{props.children}</LayoutMain>
      <Footer />
    </>
  );
}
