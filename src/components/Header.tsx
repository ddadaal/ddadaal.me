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
import Icon from "../../assets/logo.svg";
import styled from "styled-components";
import { widths } from "../styles/variables";
import { FaHome, FaRss, FaMale, FaGlobe, FaFile, FaInfo } from "react-icons/fa";
import I18nString from "../i18n/I18nString";
import lang from "../i18n/lang";
import LanguageSelector from "./LanguageSelector";
import { I18nConsumer } from "../i18n/I18nContext";
import { ArticleGroups } from "../models/ArticleGroups";
import { removeLangFromPath, getNodeFromLang } from "../utils/articleGroupUtils";

interface Props {
  title: string;
  location: Location;
  articleGroups: ArticleGroups;
}

interface State {
  isOpen: boolean;
}

function NavLink(props: { to: string, children: React.ReactNode }) {
  return (
    <Link to={props.to} className="nav-link">
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

const NavbarDiv = styled.div`
  background-color: #303030;

  & > *{
    max-width: ${widths.xl}px;
    margin-left: auto;
    margin-right: auto;
  }
`;

function atHomePage(pathname: string) {
  return pathname === "/" || pathname.match(/\/\d+/) !== null;
}

const root = lang().headers;


export function NavbarLanguageSelector() {
  return (
    <I18nConsumer>
      {({ language, changeLanguage, allLanguages }) => {
        return <LanguageSelector
          allLanguages={allLanguages}
          currentLanguage={language.name}
          changeLanguage={changeLanguage}
          prompt={language.definitions.languageSelector.select}
        />
      }}
    </I18nConsumer>
  )
}



function PathItem(props: {
  Outer: React.ComponentType<{ active: boolean }>,
  children?: React.ReactNode,
  id_name: string,
  currentPathname: string,
  articleGroups: ArticleGroups
}) {
  const { Outer, children, currentPathname, id_name, articleGroups } = props;
  return (
    <I18nConsumer>
      {({ language }) => {
        const node = getNodeFromLang(language, id_name, articleGroups);
        return (
          <Outer active={removeLangFromPath(currentPathname).startsWith(removeLangFromPath(node.path!))}>
            <NavLink to={node.path!}>
              {children}
            </NavLink>
          </Outer>
        );
      }}
    </I18nConsumer>
  )
}

export default class Header extends React.PureComponent<Props, State> {

  state = {
    isOpen: false,
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const { pathname } = this.props.location;
    return (
      <NavbarDiv>
        <Navbar color="light" light={true} expand="md">
          <Branding title={this.props.title} />
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar={true}>
            <Nav className="ml-auto" navbar={true}>
              <NavItem active={atHomePage(removeLangFromPath(pathname))}>
                <NavLink to="/">
                  <FaHome />
                  <I18nString id={root.home} />
                </NavLink>
              </NavItem>
              <PathItem
                Outer={NavItem}
                id_name={"resume"}
                articleGroups={this.props.articleGroups}
                currentPathname={pathname}
              >
                <FaFile />
                <I18nString id={root.resume} />
              </PathItem>
              <UncontrolledDropdown nav={true} inNavbar={true}>
                <DropdownToggle
                  nav={true}
                  caret={true}
                  className={removeLangFromPath(pathname).startsWith("/about/") ? "active" : undefined}
                >
                  <FaInfo />
                  <I18nString id={root.about._root} />
                </DropdownToggle>
                <DropdownMenu right={true}>
                  <PathItem
                    Outer={DropdownItem}
                    id_name={"odyssey"}
                    articleGroups={this.props.articleGroups}
                    currentPathname={pathname}
                  >
                    <FaMale />
                    <I18nString id={root.about.odyssey} />
                  </PathItem>
                  <PathItem
                    Outer={DropdownItem}
                    id_name={"about-project"}
                    articleGroups={this.props.articleGroups}
                    currentPathname={pathname}
                  >
                    <FaGlobe />
                    <I18nString id={root.about.website} />
                  </PathItem>

                  <PathItem
                    Outer={DropdownItem}
                    id_name={"about-me"}
                    articleGroups={this.props.articleGroups}
                    currentPathname={pathname}
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
        </Navbar>
      </NavbarDiv>
    );
  }

}
