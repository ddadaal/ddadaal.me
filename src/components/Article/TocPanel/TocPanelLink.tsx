import * as React from "react";
import styled from "styled-components";
import ScrollLinkToAnchor from "./ScrollLinkToAnchor";
import { colors } from "@/styles/variables";

interface Props {
  active: boolean;
  targetAnchor: string;
  depth: number;
  children: React.ReactNode;
}

const Item = styled(ScrollLinkToAnchor) <{
  depth: number;
}>`
  padding-left: ${props => props.depth * 16}px;
  :hover {
    cursor: pointer;
  }
  display: block;
  padding-bottom: 8px;


  &.active {
    border-left: 4px solid ${colors.tocLinkActiveColor};
    padding-left: ${props => props.depth * 16-4}px;
    color: ${colors.tocLinkActiveColor} !important;
  }

  :hover {
    color: ${colors.tocLinkActiveColor} !important;
  }
`;


export default function TocPanelLink(props: Props) {
  const { active, depth, targetAnchor, children } = props;

  return (
    <Item
      className={active ? "active" : undefined}
      depth={depth}
      targetAnchor={targetAnchor}
    >
      {children}
    </Item>

  )
}
