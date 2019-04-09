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
import React, { useState, useEffect, useRef } from "react";
import Icon from "~/assets/logo.svg";
import styled from "styled-components";
import { widths, heights, colors, breakpoints } from "@/styles/variables";
import { FaHome, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import { LocationStore } from "@/stores/LocationStore";
import SearchBar from "@/components/Header/SearchBar";
import { useStore } from "simstate";
import NavbarLanguageSelector from "@/components/Header/NavbarLanguageSelector";
import ArticlePathItem from "@/components/Header/ArticlePathItem";
import NavItem from "@/components/Header/NavItem";

interface Props {
  title: string;

}

interface State {
  isOpen: boolean;
}

const StyledLogo = styled(Icon)`
  width: 42px;
  height: 42px;
  margin-right: 8px;
`;

function Branding(props: { title: string }) {
  return (
    <Link to={"/"} className={"navbar-brand"}>
      <StyledLogo />
      {props.title}
    </Link>
  );
}

const root = lang.headers;

const StyledDropdownItem = styled(DropdownItem)`
  .nav-link {
    color: black !important;

  }

  .nav-link:hover {
    color: white !important;
  }
`;

const StyledNavbar = styled(Navbar)`
  max-width: ${widths.mainContent}px;
  margin-left: auto;
  margin-right: auto;
  padding: 4px 16px;

  // background-color: ${colors.headerBg};
    
  transition: width 0.2s ease-in-out;

`;

const Container = styled.header`
  .transparent {
    background-color: transparent !important;
  }
  transition: background-color 0.3s linear;
`;

const Placeholder = styled.div`
  height: ${(props: { height: number }) => props.height}px;
  transition: height 0.3s ease-in-out;

  @media (min-width: ${breakpoints.md}px) {
    height: ${heights.header}px;
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
    box-shadow: 0 .3rem .6rem rgba(0,0,0,.3);
`;

const NavbarContainer = styled.div`
  background-color: ${colors.headerBg};
`;

export default function Header(props: Props) {
  const locationStore = useStore(LocationStore);

  const [isOpen, setOpen] = useState(false);

  const { pathname } = locationStore;

  const close = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Placeholder className={"bg-primary"} height={isOpen ? 250 : heights.header} />
      <NavbarContainer className="fixed-top">
        <StyledNavbar dark={true} expand="md">
          <Branding title={props.title} />
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <BSNavItem>
                <SearchBar onSearch={close} />
              </BSNavItem>
              <NavItem active={pathname === "/"} to="/" onClick={close}>
                <FaHome />
                <LocalizedString id={root.home} />
              </NavItem>
              <NavItem active={pathname.startsWith("/articles")} to="/articles" onClick={close}>
                <FaBookOpen />
                <LocalizedString id={root.articles} />
              </NavItem>
              {/* <NavItem active={pathnameWithoutLanguage.startsWith("/articlePlans")}>
                <NavLink to="/articlePlans" onClick={close}>
                  <FaCalendarAlt />
                  <LocalizedString id={root.articlePlans} />
                </NavLink>
              </NavItem> */}
              <ArticlePathItem
                Outer={BSNavItem}
                id={"resume"}
                onClick={close}
              >
                <FaFile />
                <LocalizedString id={root.resume} />
              </ArticlePathItem>
              <UncontrolledDropdown nav={true} inNavbar={true}>
                <DropdownToggle
                  nav={true}
                  caret={true}
                  className={pathname.startsWith("/about/") ? "active" : undefined}
                >
                  <FaInfo />
                  <LocalizedString id={root.about._root} />
                </DropdownToggle>
                <StyledDropdownMenu right={true}>
                  <ArticlePathItem
                    Outer={StyledDropdownItem}
                    id={"odyssey"}
                    onClick={close}
                  >
                    <FaBookOpen />
                    <LocalizedString id={root.about.odyssey} />
                  </ArticlePathItem>
                  <ArticlePathItem
                    Outer={StyledDropdownItem}
                    id={"about-project"}
                    onClick={close}
                  >
                    <FaGlobe />
                    <LocalizedString id={root.about.website} />
                  </ArticlePathItem>

                  <ArticlePathItem
                    Outer={StyledDropdownItem}
                    id={"about-me"}
                    onClick={close}
                  >
                    <FaMale />
                    <LocalizedString id={root.about.me} />
                  </ArticlePathItem>
                </StyledDropdownMenu>
              </UncontrolledDropdown>
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
