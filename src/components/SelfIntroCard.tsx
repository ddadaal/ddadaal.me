import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaEllipsisH, FaEnvelope, FaFile } from "react-icons/fa";
import { Link } from "gatsby";
import StackedDiv from "../layouts/components/StackedDiv";

interface Props {

}

export default function SelfIntroCard(props: Props) {
  return (
    <Card>
      <CardBody>
        <CardTitle>Author</CardTitle>
        <CardSubtitle>Chen Junda</CardSubtitle>
      </CardBody>
      <CardBody>
        <CardText>Undergraduate student in Nanjing University since 2016</CardText>
        <CardText>Major in Software Engineering</CardText>
        <StackedDiv>
          <Link className="card-link" to="/resume"><FaFile/> Resume</Link>
          <CardLink href="mailto://smallda@outlook.com"><FaEnvelope/> Mail to me</CardLink>
          <Link className="card-link" to="/about/me"><FaEllipsisH/> More about me</Link>
        </StackedDiv>
      </CardBody>
    </Card>
  );
}
