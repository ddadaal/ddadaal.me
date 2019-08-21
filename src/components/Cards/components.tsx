import React from "react";
import { Card, CardProps, CardHeader, CardHeaderProps } from "reactstrap";

const BaseCard: React.FC<CardProps> = ({ className, ...props}) => {
  return (
    <Card {...props} className={`${className || ""} hover-card`}>
      {props.children}
    </Card>
  );
}

const BaseCardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => {
  return (
    <CardHeader {...props} className={`${className || ""} d-flex justify-content-between align-items-center`}>
      {props.children}
    </CardHeader>
  );
}

export { BaseCard, BaseCardHeader };
