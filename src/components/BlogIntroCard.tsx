import * as React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss } from "react-icons/fa";
import StackedDiv from "../layouts/components/StackedDiv";

interface Props {

}

export default function BlogIntroCard(props: Props) {
  return (
    <Card>
      <CardBody>
        <CardTitle>VicBlog</CardTitle>
        <CardSubtitle>A Personal Blog</CardSubtitle>
      </CardBody>
      <CardBody>
        <CardText>Articles on technologies, experiences and my daily life</CardText>
        <StackedDiv>
          <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby">
            <FaCode/> Blog Source Code on GitHub
          </CardLink>
          <CardLink href="/rss.xml">
            <FaRss/> RSS
          </CardLink>
        </StackedDiv>
      </CardBody>
    </Card>
  );
}
