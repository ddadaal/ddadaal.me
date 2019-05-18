import React, { useState } from "react";
import { Flexbox, Box, useDropdown, Dropdown, DropdownItem, DropdownHeader, DropdownDivider, DropdownToggle } from "@/vicui";
import Logo from "@/components/Header/Logo";
import NavbarLanguageSelector from "@/components/Header/NavbarLanguageSelector";
import { breakpoints } from "@/styles/variables";
import MediaQuery from "react-responsive";
import lang from "@/i18n/lang";
import { FaHome, FaBook, FaInfo } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import styled from "styled-components";
import { Link, navigate } from "gatsby";
import { useStore } from "simstate";
import { LocationStore } from "@/stores/LocationStore";

interface Props {
  transparentHeader: boolean;
}

const root = lang.headers;

enum LinkMatchType {
  EXACT, STARTS_WITH,
}

const links = [
  { target: "/", Icon: FaHome, textId: root.home, matchType: LinkMatchType.EXACT },
  { target: "/articles", Icon: FaBook, textId: root.articles, matchType: LinkMatchType.STARTS_WITH },
  // { target: "/resources", icon: },
  { target: "/about", Icon: FaInfo, textId: root.about._root, matchType: LinkMatchType.STARTS_WITH },
];

type NavbarLink = typeof links[0];

function isMatch(pathname: string, matchType: LinkMatchType, target: string) {
  switch (matchType) {
    case LinkMatchType.EXACT:
      return pathname === target;
    case LinkMatchType.STARTS_WITH:
      return pathname.startsWith(target);
  }
}

const NavbarItem = styled(Link)`
  margin: 8px;
  text-decoration: none;

  svg {
    vertical-align: bottom;
    margin-right: 4px;
  }

  &:visited { color: initial; }

  &:hover, &:active, &.active { color: var(--color-primary); }


`;

export default function Navbar(props: Props) {

  const locationStore = useStore(LocationStore);
  console.log(locationStore.pathname);

  return (
    <Flexbox justifyContent="space-between">
      <Flexbox alignItems="center">
        <Logo />
      </Flexbox>
      <Flexbox alignItems="center">
        <MediaQuery minWidth={breakpoints.md}>
          {links.map(({ target, textId, Icon, matchType }) => (
            <NavbarItem
              key={target}
              to={target}
              className={
                isMatch(locationStore.pathname, matchType, target) ? "active" : undefined}
            >
              <Icon />
              <LocalizedString id={textId} />
            </NavbarItem>))
          }
        </MediaQuery>
        <NavbarLanguageSelector />

        <MediaQuery maxWidth={breakpoints.md}>
          <MenuDropdown pathname={locationStore.pathname} />
        </MediaQuery>
      </Flexbox>
    </Flexbox>
  );
}

function MenuDropdown({ pathname }: { pathname: string }) {

  const [open, toggle] = useDropdown(false);

  return (
    <Dropdown trigger={
      <DropdownToggle onClick={toggle} width={"128px"}>下</DropdownToggle>
    } open={open}>
      {links.map((link) => (
        <DropdownItem
          key={link.target}
          onClick={() => navigate(link.target)}
          active={isMatch(pathname, link.matchType, link.target)}
        >
          <link.Icon />
          <LocalizedString id={link.textId} />
        </DropdownItem>
      ))}
    </Dropdown>
  )
}
