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
import * as React from "react";
import Icon from "~/assets/logo.svg";
import styled from "styled-components";
import { widths, heights, colors, breakpoints } from "@/styles/variables";
import { FaHome, FaRss, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen } from "react-icons/fa";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import LanguageSelector from "./LanguageSelector";
import { ArticleGroups } from "@/models/ArticleGroups";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore, removeLangFromPath } from "@/stores/LocationStore";
import SearchBar from "@/components/Search/SearchBar";

interface Props extends WithStoresProps {
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
  return pathname === "/" || pathname.match(/\/\d+/) !== null;
}

const root = lang.headers;


const NavbarLanguageSelector = withStores(I18nStore)(({ useStore }) => {

  const { state, allLanguages, changeLanguage } = useStore(I18nStore);

  return (
    <LanguageSelector
      allLanguages={allLanguages}
      currentLanguage={state.language.name}
      changeLanguage={changeLanguage}
      prompt={state.language.definitions.languageSelector.select}
    />
  );
});


function doNothing() {

}

const PathItem = withStores(ArticleStore, I18nStore)((props: {
  Outer: React.ComponentType<{ active: boolean }>,
  children?: React.ReactNode,
  id: string,
  currentPathname: string,
  onClick?(): void,
} & WithStoresProps) => {

  const { Outer, children, currentPathname, id, useStore, onClick } = props;
  const articleStore = useStore(ArticleStore);

  const { language } = useStore(I18nStore);
  const node = articleStore.getNodeFromLang(id, language);

  return (
    <Outer active={currentPathname.startsWith(removeLangFromPath(node.path))}>
      <NavLink to={node.path} onClick={onClick || doNothing}>
        {children}
      </NavLink>
    </Outer>
  );

});

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

`;

const Container = styled.div`
`;

const Placeholder = styled.div<{ height: number }>`
  height: ${props => props.height}px;
  transition: height 0.3s ease-in-out;

  @media (min-width: ${breakpoints.md}px) {
    height: ${heights.header}px;
  }
`;


class Header extends React.PureComponent<Props, State> {

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  close = () => {
    this.setState({ isOpen: false });
  }

  render() {
    const locationStore = this.props.useStore(LocationStore);

    const { pathnameWithoutLanguage } = locationStore;

    return (
      <Container>
        <Placeholder height={this.state.isOpen ? 250 : heights.header} />
        <div className="fixed-top bg-primary">
          <StyledNavbar dark={true} expand="md" className="bg-primary">
            <Branding title={this.props.title} />
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar={true}>
              <Nav className="ml-auto" navbar={true}>
                <NavItem>
                  <SearchBar />
                </NavItem>
                <NavItem active={atHomePage(pathnameWithoutLanguage)}>
                  <NavLink to="/">
                    <FaHome />
                    <I18nString id={root.home} />
                  </NavLink>
                </NavItem>
                <PathItem
                  Outer={NavItem}
                  id={"resume"}
                  currentPathname={pathnameWithoutLanguage}
                >
                  <FaFile />
                  <I18nString id={root.resume} />
                </PathItem>
                <UncontrolledDropdown nav={true} inNavbar={true}>
                  <DropdownToggle
                    nav={true}
                    caret={true}
                    className={pathnameWithoutLanguage.startsWith("/about/") ? "active" : undefined}
                  >
                    <FaInfo />
                    <I18nString id={root.about._root} />
                  </DropdownToggle>
                  <DropdownMenu right={true}>
                    <PathItem
                      Outer={StyledDropdownItem}
                      id={"odyssey"}
                      currentPathname={pathnameWithoutLanguage}
                    >
                      <FaBookOpen />
                      <I18nString id={root.about.odyssey} />
                    </PathItem>
                    <PathItem
                      Outer={StyledDropdownItem}
                      id={"about-project"}
                      currentPathname={pathnameWithoutLanguage}
                    >
                      <FaGlobe />
                      <I18nString id={root.about.website} />
                    </PathItem>

                    <PathItem

                      Outer={StyledDropdownItem}
                      id={"about-me"}
                      currentPathname={pathnameWithoutLanguage}
                    >
                      <FaMale />
                      <I18nString id={root.about.me} />
                    </PathItem>
                  </DropdownMenu>
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

}

export default withStores(LocationStore)(Header);
