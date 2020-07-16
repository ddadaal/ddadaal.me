import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "@/i18n";
import { Badge, ListGroup, ListGroupItem } from "reactstrap";
import ListGroupHeader from "@/components/UI/ListGroup/ListGroupHeader";
import friendLinks from "@/configs/friendLinks";
import styled from "styled-components";

interface Props {

}

const root = lang.friends;

const NameSpan = styled.span`
  color: black;
`;

const FriendsCard: React.FC<Props> = () => {
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
};

export default FriendsCard;
