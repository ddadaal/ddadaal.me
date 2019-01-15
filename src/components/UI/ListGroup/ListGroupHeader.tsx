import * as React from "react";
import { ListGroupItemProps, ListGroupItem } from "reactstrap";
import styled from "styled-components";

interface Props extends ListGroupItemProps {
}

export default function ListGroupHeader(props: Props) {
  const { className, ...rest } = props;
  return (
    <ListGroupItem className={`list-group-header ${className}`} {...rest} />
  );
}
