import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle, CardHeader, Alert, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, UncontrolledTooltip } from "reactstrap";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";
import { FaUserFriends } from "react-icons/fa";

const root = lang.friends;

const links = [
  { name: "idealclover", description: "翠翠酱的个人网站", link: "https://idealclover.top" },
];


export default function FriendsCard() {
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <span><FaUserFriends /> <I18nString id={root.title} /></span>
        <div>
          <span id="UncontrolledTooltipExample">?</span>
          <UncontrolledTooltip placement="left" target="UncontrolledTooltipExample">
            <I18nString id={root.hire} />
          </UncontrolledTooltip>
        </div>
      </CardHeader>
      <CardBody>
        <ListGroup>
          {links.map((x) => {
            return (
              <ListGroupItem key={x.name}>
                <ListGroupItemHeading><CardLink href={x.link}>{x.name}</CardLink></ListGroupItemHeading>
                <ListGroupItemText>
                  {x.description}
                </ListGroupItemText>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      </CardBody>
    </Card>
  );
}
