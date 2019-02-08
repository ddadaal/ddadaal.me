import {
  Collapse, DropdownItem, DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavItem,
  NavbarToggler,
  NavLink as ReactstrapNavLink,
  UncontrolledDropdown,
} from "reactstrap";
import { Link } from "gatsby";
import React, { useState } from "react";
import Icon from "~/assets/logo.svg";
import styled from "styled-components";
import { widths, heights, colors, breakpoints } from "@/styles/variables";
import { FaHome, FaRss, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import LanguageSelector from "../LanguageSelector";
import { ArticleGroups } from "@/models/ArticleGroups";

import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore } from "@/stores/LocationStore";
import SearchBar from "@/components/Header/SearchBar";
import { useStore } from "@/stores/stater";

interface Props {
  title: string;

}

interface State {
  isOpen: boolean;
}

function NavLink(props: { to: string, children: React.ReactNode, onClick?(): void }) {
  return (
    <Link to={props.to} onClick={props.onClick} className="nav-link">
      {props.children}
    </Link>
  );
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

function atHomePage(pathname: string) {
  return pathname === "/" || pathname.match(/\/articles\/\d+/) !== null;
}

const root = lang.headers;

const NavbarLanguageSelector = () => {

  const { state, allLanguages, changeLanguage } = useStore(I18nStore);

  return (
    <LanguageSelector
      allLanguages={allLanguages}
      currentLanguage={state.language.name}
      changeLanguage={changeLanguage}
      prompt={state.language.definitions.languageSelector.select}
    />
  );
};

function doNothing() {

}

const ArticlePathItem = (props: {
  Outer: React.ComponentType<{ active: boolean }>,
  children?: React.ReactNode,
  id: string,
  onClick?(): void,
}) => {

  const { Outer, children, id, onClick } = props;
  const { pathname } = useStore(LocationStore);
  const articleStore = useStore(ArticleStore);

  const { language } = useStore(I18nStore);
  const node = articleStore.getNodeFromLang(id, language);

  const targetPageUrlParts = node.path.split("/");
  targetPageUrlParts.pop();

  const active = pathname.startsWith(targetPageUrlParts.join("/"))

  return (
    <Outer active={active}>
      <NavLink to={node.path} onClick={onClick || doNothing}>
        {children}
      </NavLink>
    </Outer>
  );

};

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

  background-color: ${colors.headerBg};

`;

const Container = styled.header`
`;

const Placeholder = styled.div`
  height: ${(props: { height: number }) => props.height}px;
  transition: height 0.3s ease-in-out;

  background-color: ${colors.headerBg};


  @media (min-width: ${breakpoints.md}px) {
    height: ${heights.header}px;
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
    box-shadow: 0rem .3rem .6rem rgba(0,0,0,.3);
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
      <Placeholder height={isOpen ? 250 : heights.header} />
      <div className="fixed-top bg-primary">
        <StyledNavbar dark={true} expand="md">
          <Branding title={props.title} />
          <NavbarToggler onClick={() => setOpen(!isOpen)} />
          <Collapse isOpen={isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem>
                <SearchBar onSearch={close} />
              </NavItem>
              <NavItem active={atHomePage(pathname)}>
                <NavLink to="/" onClick={close}>
                  <FaHome />
                  <LocalizedString id={root.home} />
                </NavLink>
              </NavItem>
              {/* <NavItem active={pathnameWithoutLanguage.startsWith("/articlePlans")}>
                <NavLink to="/articlePlans" onClick={close}>
                  <FaCalendarAlt />
                  <LocalizedString id={root.articlePlans} />
                </NavLink>
              </NavItem> */}
              <ArticlePathItem
                Outer={NavItem}
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
              <NavItem>
                <NavbarLanguageSelector />
              </NavItem>
            </Nav>
          </Collapse>
        </StyledNavbar>
      </div>
    </Container>
  );
}
