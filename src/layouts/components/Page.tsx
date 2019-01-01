import * as React from "react";
import styled from "styled-components";
import { dimensions, widths } from "@/styles/variables";

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
  padding: ${dimensions.containerPadding}rem;
  margin-bottom: 3rem;
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
  max-width: ${widths.xl}px;
`;

export default function Page(props: PageProps) {
  return (
    <StyledPage className={props.className}>
      <StyledContainer>
        {props.children}
      </StyledContainer>
    </StyledPage>
  );
}
