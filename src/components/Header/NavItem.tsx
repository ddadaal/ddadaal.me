import React from "react";
import { Link } from "gatsby";
import { NavItem as BSNavItem } from "reactstrap";
import NavLink from "@/components/Header/NavLink";

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
