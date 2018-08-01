import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink as ReactstrapNavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import Link, { navigateTo } from 'gatsby-link';
import * as React from 'react';
import Icon from '../../assets/logo.svg';
import styled from 'styled-components'
import { widths } from '../styles/variables';

interface Props {
  title: string;
}

interface State {
  isOpen: boolean;
}

function NavLink(props: {to: string, children: React.ReactNode}){
  return <Link to={props.to}>
    <ReactstrapNavLink>
      {props.children}
    </ReactstrapNavLink>
  </Link>
}

const StyledLogo = styled(Icon)`
  width: 42px;
  height: 42px;
  margin-right: 8px;
`

function Branding(props: {title: string}) {
  return <Link to={"/"} className={"navbar-brand"}>
      <StyledLogo/>
    {props.title}
  </Link>
}

export default class Header extends React.PureComponent<Props, State> {

  state = {
    isOpen: false
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  };

  render() {
    return <div>
      <Navbar color="light" light expand="md" >
        <Branding title={this.props.title}/>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about/project">About Website</NavLink>
            <NavLink to="/about/me">About Me</NavLink>
            <ReactstrapNavLink target="__blank" href="https://github.com/viccrubs">
              GitHub
            </ReactstrapNavLink>
          </Nav>
        </Collapse>
      </Navbar>
    </div>;
  }


}
