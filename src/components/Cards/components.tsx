import React from "react";
import { Card, CardProps, CardHeader, CardHeaderProps } from "reactstrap";

export function BaseCard({ className, ...props}: CardProps) {
  return (
    <Card {...props} className={`${className || ""} hover-card`}>
      {props.children}
    </Card>
  );
}

export function BaseCardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <CardHeader {...props} className={`${className || ""} d-flex justify-content-between align-items-center`}>
      {props.children}
    </CardHeader>
  );
}
