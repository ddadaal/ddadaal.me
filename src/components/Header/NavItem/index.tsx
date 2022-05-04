import React from "react";
import { DropdownItem as BSDropdownItem,NavItem as BSNavItem } from "reactstrap";
import { useStore } from "simstate";

import NavLink from "@/components/Header/NavLink";
import { Localized, TextId } from "@/i18n";
import LocationStore from "@/stores/LocationStore";

interface Props {
  Icon: React.ComponentType;
  textId: TextId;
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
          <Localized id={textId} />
        </NavLink>
      ),
    )
  );
};

export default NavItem;
