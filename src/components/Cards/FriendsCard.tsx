import * as React from "react";
import { CardLink, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, UncontrolledTooltip } from "reactstrap";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import { FaUserFriends } from "react-icons/fa";
import ListGroupHeader from "@/components/UI/ListGroup/ListGroupHeader";

const root = lang.friends;

const links = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
];


export default function FriendsCard() {
  return (

    <ListGroup>
      <ListGroupHeader className="d-flex justify-content-between align-items-center">
        <span><FaUserFriends /> <I18nString id={root.title} /></span>
        <div>
          <span id="friendscard-wanted">?</span>
          <UncontrolledTooltip placement="left" target="friendscard-wanted">
            <I18nString id={root.hire} />
          </UncontrolledTooltip>
        </div>
      </ListGroupHeader>
      {links.map((x) => {
        return (
          <ListGroupItem key={x.name}>
            <ListGroupItemHeading>
              <CardLink href={x.link}>
                {x.name}
              </CardLink>
            </ListGroupItemHeading>
            <ListGroupItemText>
              {x.description}
            </ListGroupItemText>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
