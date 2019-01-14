import * as React from "react";
import { ListGroupItemProps, ListGroupItem } from "reactstrap";
import styled from "styled-components";

interface Props extends ListGroupItemProps {
}

const StyledListGroupHeader = styled(ListGroupItem)`
  background-color: #F7F7F7;
`;

export default function ListGroupHeader(props: Props) {
  return (
    <StyledListGroupHeader {...props} />
  );
}
