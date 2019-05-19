import {
  Collapse, DropdownItem, DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavItem as BSNavItem,
  NavbarToggler,
  NavLink as ReactstrapNavLink,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "gatsby";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Icon from "~/assets/logo.svg";
import styled from "styled-components";
import { widths, heights, colors, breakpoints } from "@/styles/variables";
import { FaHome, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen, FaSlideshare, FaToolbox } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import { LocationStore } from "@/stores/LocationStore";
import SearchBar from "@/components/SearchBar";
import { useStore } from "simstate";
import NavbarLanguageSelector from "@/components/Header/NavbarLanguageSelector";
import NavItem from "@/components/Header/NavItem";
import { useEventListener } from "@/utils/useEventListener";
import Placeholder from "@/components/Header/HeaderPlaceholder";
import { isServer } from "@/utils/isServer";

interface Props {
  transparentHeader: boolean;
}

const root = lang.headers;

const StyledNavbar = styled(Navbar)`
  && {
    max-width: ${widths.mainContent}px;
    margin-left: auto;
    margin-right: auto;
    padding: 4px 8px;

    transition: width 0.2s ease-in-out;
  }
`;

const Container = styled.header`

`;

const NavbarContainer = styled.div<{ transparent: boolean }>`
  transition: background-color 0.2s ease-in-out;
  background-color: ${({ transparent }) => transparent ? "transparent" : colors.headerBg};
`;

export default function Header({ transparentHeader }: Props) {
  const [isOpen, setOpen] = useState(false);
  const [isTransparent, setTransparent] = useState(transparentHeader);

  if (!isServer()) {
    useEventListener(window, "scroll", () => {
      setTransparent(transparentHeader && window.scrollY === 0);
    }, [transparentHeader]);
  }

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Container>
      <Placeholder
        isOpen={isOpen}
        transparent={transparentHeader}
      />
      <NavbarContainer transparent={isTransparent} className="fixed-top">
        <StyledNavbar dark={true} expand="md">
          <Branding />
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem
                type="link"
                to="/"
                onClick={close}
                matchType={"exact"}
                Icon={FaHome}
                textId={root.home}
              />
              <NavItem
                type="link"
                to="/articles"
                onClick={close}
                matchType={"startsWith"}
                Icon={FaBookOpen}
                textId={root.articles}
              />
              <NavItem
                type="link"
                to="/resources"
                onClick={close}
                matchType={"startsWith"}
                Icon={FaToolbox}
                textId={root.resources}
              />
              <NavItem
                type="link"
                to="/about"
                onClick={close}
                matchType={"startsWith"}
                Icon={FaInfo}
                textId={root.about}
              />
              <BSNavItem>
                <NavbarLanguageSelector />
              </BSNavItem>
            </Nav>
          </Collapse>
        </StyledNavbar>
      </NavbarContainer>
    </Container>
  );
}

const StyledLogo = styled(Icon)`
  width: 42px;
  height: 42px;
  margin-right: 8px;
`;

function Branding() {
  return (
    <Link to={"/"} className={"navbar-brand"}>
      <StyledLogo />
      VicBlog
    </Link>
  );
}
