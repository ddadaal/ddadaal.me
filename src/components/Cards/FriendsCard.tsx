import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle, CardHeader, Alert, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from "reactstrap";
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
      <CardHeader>
        <FaUserFriends /> <I18nString id={root.title} />
      </CardHeader>
      <CardBody>
        <Alert color="info">
          <I18nString id={root.hire} />
        </Alert>
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
