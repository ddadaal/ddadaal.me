import React from "react";
import styled from "styled-components";
import { widths } from "@/styles/variables";
import moveInAnimation from "@/styles/moveInAnimation";

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
  padding: 16px;
  margin-bottom: 48px;
`;

interface PageProps {
  className?: string;
  children?: React.ReactNode;
}

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: ${widths.mainContent}px;

  animation: ${moveInAnimation} 0.2s ease-out;
`;

export default function Page(props: PageProps) {
  return (
    <StyledPage>
      <StyledContainer className={props.className}>
        {props.children}
      </StyledContainer>
    </StyledPage>
  );
}
