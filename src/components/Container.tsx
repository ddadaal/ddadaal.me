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

interface ContainerProps {
  className?: string;
}

const Container: React.SFC<ContainerProps> = ({ children, className }) => (
  <StyledContainer className={className}>{children}</StyledContainer>
);

export default Container;
