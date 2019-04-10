import NavLink from "@/components/Header/NavLink";
import React from "react";
import { NavItem as BSNavItem } from "reactstrap";
import styled from "styled-components";

interface Props {
  active: boolean;
  children?: React.ReactNode;
  to: string;
  onClick?(): void;
}

const StyledNavItem = styled(BSNavItem)`
  transition: color 0.2s ease-in-out;
`;

export default function NavItem({ active, children, to, onClick }: Props) {
  return (
    <StyledNavItem active={active}>
      <NavLink to={to} onClick={onClick}>
        {children}
      </NavLink>
    </StyledNavItem>
  );
}
