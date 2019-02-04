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
import { FaHome, FaRss, FaMale, FaGlobe, FaFile, FaInfo, FaBookOpen, FaCalendarAlt } from "react-icons/fa";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import LanguageSelector from "../LanguageSelector";
import { ArticleGroups } from "@/models/ArticleGroups";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { ArticleStore } from "@/stores/ArticleStore";
import { I18nStore } from "@/stores/I18nStore";
import { LocationStore } from "@/stores/LocationStore";
import SearchBar from "@/components/Header/SearchBar";

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
  return pathname === "/" || pathname.match(/\/articles\/\d+/) !== null;
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

const ArticlePathItem = withStores(ArticleStore, I18nStore)((props: {
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

  const targetPageUrlParts = node.path.split("/");
  targetPageUrlParts.pop();



  return (
    <Outer active={currentPathname.startsWith(targetPageUrlParts.join("/"))}>
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

  background-color: ${colors.headerBg};

`;

const Container = styled.header`
`;

const Placeholder = styled.div`
  height: ${(props: { height: number}) => props.height}px;
  transition: height 0.3s ease-in-out;

  background-color: ${colors.headerBg};


  @media (min-width: ${breakpoints.md}px) {
    height: ${heights.header}px;
  }
`;

const StyledDropdownMenu = styled(DropdownMenu)`
    box-shadow: 0rem .3rem .6rem rgba(0,0,0,.3);
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

    const { pathname } = locationStore;

    return (
      <Container>
        <Placeholder height={this.state.isOpen ? 250 : heights.header} />
        <div className="fixed-top bg-primary">
          <StyledNavbar dark={true} expand="md">
            <Branding title={this.props.title} />
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar={true}>
              <Nav className="ml-auto" navbar={true}>
                <NavItem>
                  <SearchBar onSearch={this.close} />
                </NavItem>
                <NavItem active={atHomePage(pathname)}>
                  <NavLink to="/" onClick={this.close}>
                    <FaHome />
                    <LocalizedString id={root.home} />
                  </NavLink>
                </NavItem>
                {/* <NavItem active={pathnameWithoutLanguage.startsWith("/articlePlans")}>
                  <NavLink to="/articlePlans" onClick={this.close}>
                    <FaCalendarAlt />
                    <LocalizedString id={root.articlePlans} />
                  </NavLink>
                </NavItem> */}
                <ArticlePathItem
                  Outer={NavItem}
                  id={"resume"}
                  currentPathname={pathname}
                  onClick={this.close}
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
                      currentPathname={pathname}
                      onClick={this.close}
                    >
                      <FaBookOpen />
                      <LocalizedString id={root.about.odyssey} />
                    </ArticlePathItem>
                    <ArticlePathItem
                      Outer={StyledDropdownItem}
                      id={"about-project"}
                      currentPathname={pathname}
                      onClick={this.close}
                    >
                      <FaGlobe />
                      <LocalizedString id={root.about.website} />
                    </ArticlePathItem>

                    <ArticlePathItem
                      Outer={StyledDropdownItem}
                      id={"about-me"}
                      currentPathname={pathname}
                      onClick={this.close}
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

}

export default withStores(LocationStore)(Header);
