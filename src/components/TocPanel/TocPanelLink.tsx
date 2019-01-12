import * as React from "react";
import styled from "styled-components";
import ScrollLinkToAnchor from "./ScrollLinkToAnchor";

interface Props {
  active: boolean;
  targetAnchor: string;
  depth: number;
  children: React.ReactNode;
}

const Item = styled(ScrollLinkToAnchor) <{
  depth: number;
  active: boolean;
}>`
  padding-left: ${props => props.depth * 16}px;
  :hover {
    cursor: pointer;
  }
  display: block;
  padding-top: 2px;



  ${props => props.active
    ? `
      border-left: 4px solid #3498DB;
      padding-left: ${props.depth * 16-4}px;
      color: #3498DB !important;
    `
    : ""}

  :hover {
    color: #3498DB !important;
  }
`;


export default function TocPanelLink(props: Props) {
  return (
    <Item
      active={props.active}
      depth={props.depth}
      targetAnchor={props.targetAnchor}
    >
      {props.children}
    </Item>

  )
}
