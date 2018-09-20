import * as React from "react";
import styled from "styled-components";
import { dimensions } from "../styles/variables";

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

export default function Page(props: PageProps) {
  return <StyledPage className={props.className}>
    {props.children}
    </StyledPage>;
}
