import NavLink from "@/components/Header/NavLink";
import React from "react";
import { NavItem as BSNavItem } from "reactstrap";
import styled from "styled-components";
import { useStore } from "simstate";
import { LocationStore } from "@/stores/LocationStore";

interface Props {
  matchType: "exact" | "startsWith";
  children?: React.ReactNode;
  to: string;
  onClick?(): void;
}

const StyledNavItem = styled(BSNavItem)`
  transition: color 0.2s ease-in-out;
`;

export default function LinkNavItem({ matchType, children, to, onClick }: Props) {

  const { pathname } = useStore(LocationStore);

  const active = matchType === "exact" ? pathname === to : pathname.startsWith(to);

  return (
    <StyledNavItem active={active}>
      <NavLink to={to} onClick={onClick}>
        {children}
      </NavLink>
    </StyledNavItem>
  );
}
