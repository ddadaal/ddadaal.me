import React, { useMemo } from "react";
import { useStore } from "simstate";
import { Nav, Menu, Box, BoxProps } from "grommet";
import { LocalizedString } from "simstate-i18n";
import { lang } from "@/i18n";
import { AnchorLink } from "@/components/AnchorLink";
import { Menu as MenuIcon } from "grommet-icons";
import { Link  } from "gatsby";
import { Media } from "@/styles/media";
import { TLink,  links } from "./links";
import LocationStore, { ILocationStore } from "@/stores/LocationStore";

const root = lang.headers;


const matchRoute = (mode: TLink["mode"], href: string | undefined, curr: string) => {
  if (!href || !mode) return false;
  if (mode === "exact") { return href === curr; } else { return curr.startsWith(href); }
};

function linksToAnchorLink(pathname: string, links: TLink[]) {
  return links.map(({ href, textId, mode, onClick }) => (
    <AnchorLink
      key={textId} href={href} onClick={onClick}
      margin={{ horizontal: "xsmall" }}
      active={matchRoute(mode, href, pathname)}
      label={<LocalizedString id={textId} />}
    />
  ));
}

const Unfolded: React.FC<{ pathname: string }> = ({ pathname  }) => {

  return (
    <Nav direction="row" gap="none">
      {linksToAnchorLink(pathname, links)}
    </Nav>
  );
};

function linksToMenuItem(locationStore: ILocationStore, links: TLink[]){
  return links.map(({ href, textId, mode }) => ({
    label: (
      <Box pad="medium">
        <Link to={href}>
          <LocalizedString id={textId}/>
        </Link>
      </Box>
    ),
    active: matchRoute(mode, href, locationStore.pathname),
  }));
}

const Folded: React.FC<{
  locationStore: ILocationStore,
}> = ({ locationStore }) => {

  return (
    <Nav direction="row" align="center">
      <Menu
        plain
        items={
          linksToMenuItem(locationStore, links)
        }
      >
        <Box pad={{ horizontal: "medium", vertical: "small" }}>
          <MenuIcon/>
        </Box>
      </Menu>
    </Nav>
  );

};

export const MainNav: React.FC = () => {


  const locationStore = useStore(LocationStore);


  return (
    <>
      <Media lessThan="sm">
        <Folded
          locationStore={locationStore}
        />
      </Media>
      <Media greaterThanOrEqual="sm">
        <Unfolded
          pathname={locationStore.pathname}
        />
      </Media>
    </>
  );
};
