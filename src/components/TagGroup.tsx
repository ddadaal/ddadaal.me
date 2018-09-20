import * as React from "react";
import { Badge } from "reactstrap";
import styled from "styled-components";

interface Props {
  className?: string;
  tags: string[];
}

const Container = styled.p` 
  & > * {
  margin-right: 4px;
  }
`;

export default function TagGroup(props: Props) {
  if (props.tags) {
    return <Container className={props.className}>
      {props.tags.map((x) => <Badge color={"info"} pill={true} key={x}>{x}</Badge>)}
    </Container>;
  } else {
    return null;
  }

}
