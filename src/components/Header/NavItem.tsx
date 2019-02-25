import NavLink from "@/components/Header/NavLink";
import React from "react";
import { NavItem as BSNavItem } from "reactstrap";

interface Props {
  active: boolean;
  children?: React.ReactNode;
  to: string;
  onClick?(): void;
}

export default function NavItem({ active, children, to, onClick }: Props) {
  return (
    <BSNavItem active={active}>
      <NavLink to={to} onClick={onClick}>
        {children}
      </NavLink>
    </BSNavItem>
  );
}
