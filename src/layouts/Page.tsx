import React from "react";
import styled from "styled-components";
import { widths } from "@/styles/variables";
import moveInAnimation from "@/styles/moveInAnimation";

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
  padding: 16px;

  img {
    max-width: 100%;
  }

  table {
    display: inline-block;
    overflow-x: auto;
  }

  blockquote p:last-child {
    margin-bottom: 0;
  }
`;

interface Props {
  className?: string;
  children?: React.ReactNode;
  maxWidth?: number;
}

const StyledContainer = styled.div<{ maxWidth: number }>`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: ${({ maxWidth }) => maxWidth}px;

  animation: ${moveInAnimation} 0.2s ease-out;
`;

const Page: React.FC<Props> = ({
  className, children,
  maxWidth = widths.mainContent,
}) => {
  return (
    <StyledPage>
      <StyledContainer maxWidth={maxWidth} className={className}>
        {children}
      </StyledContainer>
    </StyledPage>
  );
};

export default Page;
