import * as React from "react";
import styled from "styled-components";
import { IconContext } from "react-icons";

const StyledLayoutRoot = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  
  .icons {
    margin-top: -2px;
    margin-right: 4px;
  }
`;

interface LayoutRootProps {
  className?: string;
}

const LayoutRoot: React.SFC<LayoutRootProps> = ({ children, className }) => (
  <IconContext.Provider value={{ className: "icons"  }}>
  <StyledLayoutRoot className={className}>{children}</StyledLayoutRoot>
  </IconContext.Provider>
);

export default LayoutRoot;
