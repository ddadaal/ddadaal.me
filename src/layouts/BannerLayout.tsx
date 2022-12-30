import React from "react";
import styled from "styled-components";

import {
  InnerContainer as BaseInnerContainer,
  RootContainer as BaseRootContainer,
} from "@/layouts/LayeredLayout";
import moveInAnimation from "@/styles/moveInAnimation";
import { colors, heights } from "@/styles/variables";

import HeaderFooterLayout from "./HeaderFooterLayout";

interface Props {
  transparentHeader: boolean;
  banner: React.ReactNode;
}

const BannerLayout: React.FC<React.PropsWithChildren<Props>> = ({ transparentHeader, banner, children }) => {
  return (
    <HeaderFooterLayout transparentHeader={transparentHeader}>
      <RootContainer>
        <InnerContainer>
          <BannerContainer>
            {banner}
          </BannerContainer>
        </InnerContainer>
      </RootContainer>
      {children}
    </HeaderFooterLayout>
  );
};

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

const BannerLayoutTitle = styled.h1`
  font-size: 2em;
  padding: 4px 0;
`;

const BannerLayoutDescription = styled.h2`
  font-size: 0.9em;
  padding: 4px 0;
`;

export { BannerLayoutDescription, BannerLayoutTitle, BannerLayout as default };
