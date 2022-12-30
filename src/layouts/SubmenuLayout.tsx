import { Link as GatsbyLink } from "gatsby";
import React from "react";
import { Col, Nav as BSNav, NavItem, Row } from "reactstrap";
import { useStore } from "simstate";
import styled from "styled-components";

import { Localized, TextId } from "@/i18n";
import { BannerLayoutTitle } from "@/layouts/BannerLayout";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import Page from "@/layouts/Page";
import LocationStore from "@/stores/LocationStore";
import { colors } from "@/styles/variables";

interface NavPoint {
  textId: TextId;
  Icon: React.ComponentType;
  to: string;

}

interface Props {
  baseUrl: string;
  menuTextId: string;
  navPoints: NavPoint[];
  children: React.ReactNode;
}

const SubmenuLayout: React.FC<Props> = (props) => {

  const { pathname } = useStore(LocationStore);

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <Page>
        <Row>

          <Col md={9}>
            {props.children}
          </Col>
          <Col md={3}>
            <Nav vertical={true}>
              {/* <MenuTitle><Localized id={props.menuTextId} /></MenuTitle> */}
              {props.navPoints.map((link) => (
                <NavItem
                  key={link.to}
                  active={pathname.startsWith(props.baseUrl + link.to)}
                >
                  <Link className="nav-link" to={props.baseUrl + link.to}>
                    <link.Icon />
                    <Localized id={link.textId} />
                  </Link>
                </NavItem>
              ))}
            </Nav>
          </Col>
        </Row>
      </Page>
    </HeaderFooterLayout>
  );

};

const SubmenuLayoutTitle = styled(BannerLayoutTitle)`
  font-size: 40px;

`;

const Link = styled(GatsbyLink)`

  color: black;

  &:hover {
    cursor: pointer;
  }
`;

// const MenuTitle = styled.h2`

//   font-size: 20px;
//   padding: 8px 16px;

// `;

const Nav = styled(BSNav)`
  padding: 4px 8px;
  margin: 8px 0px;
  background-color: ${colors.extremelyLightGray};
`;

export { SubmenuLayout as default, SubmenuLayoutTitle };
