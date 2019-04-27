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
import { FaHome, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen, FaSlideshare } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import { LocationStore } from "@/stores/LocationStore";
import SearchBar from "@/components/SearchBar";
import { useStore } from "simstate";
import NavbarLanguageSelector from "@/components/Header/NavbarLanguageSelector";
import ArticlePathItem from "@/components/Header/ArticlePathItem";
import NavItem from "@/components/Header/NavItem";

interface Props {
  transparentHeader: boolean;
}

const root = lang.headers;

const StyledDropdownItem = styled(DropdownItem)`
  .nav-link {
    color: ${({ active }) => active ? "white" : "black"}!important;

  }
  
  .active > a {
    color: white !important;
  }

  .nav-link:hover {
    color: white !important;
  }
`;

const StyledNavbar = styled(Navbar)`
  max-width: ${widths.mainContent}px;
  margin-left: auto;
  margin-right: auto;
  padding: 4px 8px;

  transition: width 0.2s ease-in-out;

`;

const Container = styled.header`

`;

interface PlaceholderProps { isOpen: boolean; transparent: boolean; }

const Placeholder = styled.div`
  
  background-color: ${colors.headerBg};
  height: ${({ isOpen, transparent }: PlaceholderProps) => isOpen ? 300 : transparent ? 0 : heights.header}px;

  @media (max-width: ${breakpoints.md}px) {
    transition: height 0.3s ease-in-out;

  }

  @media (min-width: ${breakpoints.md}px) {
    height: ${({ transparent }: PlaceholderProps) => transparent ? 0 : heights.header}px;
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
    box-shadow: 0 .3rem .6rem rgba(0,0,0,.3);
`;

const NavbarContainer = styled.div`
  transition: background-color 0.2s ease-in-out;
`;

export default function Header({ transparentHeader }: Props) {
  const locationStore = useStore(LocationStore);

  const [isOpen, setOpen] = useState(false);

  const { pathname } = locationStore;

  const navbarRef = useRef<HTMLDivElement>(null);

  const atHomePage = pathname === "/";

  useEffect(() => {

    const navbar = navbarRef.current!!;

    const handler = () => {
      if (transparentHeader && window.scrollY === 0) {
        navbar.style.backgroundColor = "transparent";
      } else {
        navbar.style.backgroundColor = colors.headerBg;
      }
    };
    handler();

    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, [transparentHeader]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Container>
      <Placeholder
        isOpen={isOpen}
        transparent={transparentHeader}
       />
      <NavbarContainer ref={navbarRef} className="fixed-top">
        <StyledNavbar dark={true} expand="md">
          <Branding />
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem active={atHomePage} to="/" onClick={close}>
                <FaHome />
                <LocalizedString id={root.home} />
              </NavItem>
              <NavItem active={pathname.startsWith("/articles")} to="/articles" onClick={close}>
                <FaBookOpen />
                <LocalizedString id={root.articles} />
              </NavItem>
              <NavItem active={pathname.startsWith("/slides")} to="/slides" onClick={close}>
                <FaSlideshare />
                <LocalizedString id={root.slides} />
              </NavItem>
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
