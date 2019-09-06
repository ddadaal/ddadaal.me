import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import { useStore } from "simstate";
import LocationStore from "@/stores/LocationStore";
import NavLink from "@/components/Header/NavLink";
import { NavItem as BSNavItem, DropdownItem as BSDropdownItem } from "reactstrap";

interface Props {
  Icon: React.ComponentType;
  textId: string;
  onClick?(): void;
  wrapper: "navItem" | "dropdownItem";
  match: "exact" | "startsWith" | ((pathname: string) => boolean);
  to: string;
}

const NavItem: React.FC<Props> = ({ Icon, textId, onClick, wrapper, match, to }) => {

  const { pathname } = useStore(LocationStore);

  const active = typeof match === "function"
    ? match(pathname)
    : match === "exact"
      ? pathname === to
      : pathname.startsWith(to);

  return (
    React.createElement(
      wrapper === "navItem" ? BSNavItem : BSDropdownItem,
      { active },
      (
        <NavLink to={to} onClick={onClick}>
          <Icon />
          <LocalizedString id={textId} />
        </NavLink>
      ),
    )
  );
}

export default NavItem;
