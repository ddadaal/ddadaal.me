import React from "react";
import { Header as GrommetHeader, Box, Avatar, Anchor } from "grommet";
import { AnchorLink } from "@/components/AnchorLink";
import styled from "styled-components";
import { MainNav } from "./MainNav";
import { Logo } from "@/components/Header/Logo";

const FlexAnchorLink = styled(AnchorLink)`
  display: flex;
`;

export const Header: React.FC = (props) => {
  return (
    <GrommetHeader
      background="background"
      pad="small"
      elevation="small"
      border={{ side: "bottom" }}
      align="center"
      justify="center"
    >
      <Box width="xlarge">

        <Box fill direction="row" justify="between" align="stretch">
          <Box width="xsmall" direction="column" justify="center">
            <FlexAnchorLink href="/">
              <Logo />
            </FlexAnchorLink>
          </Box>
          <Box direction="row" align="center" gap="small">
            <MainNav />
          </Box>
        </Box>
      </Box>
    </GrommetHeader>
  );
};
