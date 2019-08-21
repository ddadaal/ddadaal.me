import React from "react";
import { ListGroupItemProps, ListGroupItem } from "reactstrap";

interface Props extends ListGroupItemProps {
}

const ListGroupHeader: React.FC<Props> = (props) => {
  const { className, ...rest } = props;
  return (
    <ListGroupItem className={`list-group-header ${className}`} {...rest} />
  );
};

export default ListGroupHeader;
