import React from "react";
import { useStore } from "~/node_modules/simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import friends from "@/configs/friendLinks";
import { Badge, CardBody, CardText, ListGroup, ListGroupItem } from "reactstrap";
import ListGroupHeader from "@/components/UI/ListGroup/ListGroupHeader";
import friendLinks from "@/configs/friendLinks";
import { Link } from "gatsby";
import styled from "styled-components";

interface Props {

}

const root = lang.friends;

const NameSpan = styled.span`
  color: black;
`;

export default function FriendsCard(props: Props) {
  return (
    <ListGroup flush={false} className="hover-card">
      <ListGroupHeader>
        👨‍🎓 <LocalizedString id={root.title}/>
      </ListGroupHeader>
      {friendLinks.map(({ name, description, link }) => (
        <ListGroupItem tag={"a"} action={true} target="_blank" href={link} key={name}
                       className="d-flex justify-content-between align-items-center">
          <NameSpan>{name}</NameSpan>
          <Badge color={"primary"}>{description}</Badge>
        </ListGroupItem>
      ))}
    </ListGroup>
  );
}
