import React from "react";
import styled, { keyframes } from "styled-components";
import { widths } from "@/styles/variables";

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

const enterAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: ${widths.mainContent}px;

  animation: ${enterAnimation} 0.2s ease-out;
`;

export default function Page(props: PageProps) {
  return (
    <StyledPage>
      <StyledContainer  className={props.className}>
        {props.children}
      </StyledContainer>
    </StyledPage>
  );
}
