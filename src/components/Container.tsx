import * as React from "react";
import styled from "styled-components";

import { widths } from "../styles/variables";

const StyledContainer = styled.div`
  position: relative;
  margin-left: auto;
  margin-right: auto;
  width: auto;
  max-width: ${widths.xl}px;
`;

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: Props) {
  return <StyledContainer className={className}>{children}</StyledContainer>;
}
