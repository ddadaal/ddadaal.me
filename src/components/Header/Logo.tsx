import React from "react";
import LogoSvg from "~/assets/logo.svg";
import { AnchorLink } from "@/components/AnchorLink";
import { Image } from "grommet";
import styled from "styled-components";

const StyledLogo = styled(LogoSvg)`
  display: flex;
  fit: contain;
`;

export const Logo: React.FC = () => {
  return (
    <AnchorLink href={"/"}>
      <StyledLogo />
      ddadaal.me
    </AnchorLink>
  );
};
