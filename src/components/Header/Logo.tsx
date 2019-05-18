import Icon from "~/assets/logo.svg";
import styled from "styled-components";
import React from "react";
import { Link } from "@/vicui";
import { navigate } from "gatsby";

const StyledLogo = styled(Icon)`
  width: 42px;
  height: 42px;
  margin-right: 8px;
`;

const Text = styled.span`
  color: var(--color-font);
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;

  color: var(--color-font);

  &&:hover {
    text-decoration: none;
  }
`;

const toHome = () => {
  navigate("/");
};

export default function Logo() {
  return (
    <StyledLink onClick={toHome}>
      <StyledLogo />
      <Text>VicBlog</Text>
    </StyledLink>
  );
}
