import React from "react";
import BannerLayout from "@/layouts/BannerLayout";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import { Nav, NavLink, NavItem, Row, Col } from "reactstrap";
import lang from "@/i18n/lang";
import { FaSlideshare, FaFile } from "react-icons/fa";
import { navigate } from "gatsby";
import LocalizedString from "@/i18n/LocalizedString";
import Page from "@/layouts/Page";
import SubmenuLayout from "@/layouts/SubmenuLayout";

interface Props {
  children: React.ReactNode;
}

const root = lang.resources;

const basePath = "/resources/";

const links = [
  { textId: root.slides.title, Icon: FaSlideshare, to: "slides" },
  { textId: root.resume.title, Icon: FaFile, to: "resume" },
];

export default function ResourcePageLayout(props: Props) {
  return (
    <SubmenuLayout baseUrl="/resources/" navPoints={links} menuTextId={root.title}>
      {props.children}
    </SubmenuLayout>
  );
}
