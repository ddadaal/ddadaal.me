import * as React from "react";
import styled from "styled-components";

const StyledLayoutMain = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

interface LayoutMainProps {
  children: React.ReactNode;
  className?: string;
}

export default function LayoutMain({ children, className }: LayoutMainProps) {
  return <StyledLayoutMain className={className}>{children}</StyledLayoutMain>;
}
