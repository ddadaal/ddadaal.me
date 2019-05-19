import React, { PropsWithChildren } from "react";
import HeaderFooterLayout from "./HeaderFooterLayout";
import styled from "styled-components";
import { heights, colors } from "@/styles/variables";
import {
  RootContainer as BaseRootContainer,
  InnerContainer as BaseInnerContainer,
} from "@/layouts/LayeredLayout";
import moveInAnimation from "@/styles/moveInAnimation";

interface Props {
  transparentHeader: boolean;
  banner: React.ReactNode;
}

export default function BannerLayout(props: PropsWithChildren<Props>) {
  return (
    <HeaderFooterLayout transparentHeader={props.transparentHeader}>
      <RootContainer>
        <InnerContainer>
          <BannerContainer>
          {props.banner}
          </BannerContainer>
        </InnerContainer>
      </RootContainer>
      {props.children}
    </HeaderFooterLayout>
  );
}

const RootContainer = styled(BaseRootContainer)`
  height: ${heights.banner}px;
  width: 100%;
  background-color: ${colors.headerBg};

`;

const InnerContainer = styled(BaseInnerContainer)`
  height: ${heights.banner}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${moveInAnimation} 0.2s ease-out;
`;

const BannerContainer = styled.div`
  text-align: center;
  color: white;
  padding: 0px 8px 8px 8px;
`;

BannerLayout.Title = styled.h1`
  font-size: 2em;
  padding: 4px 0;
`;
