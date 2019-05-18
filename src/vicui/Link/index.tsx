import React from "react";
import { BoxProps, Box } from "../primitives";
import pickClass from "../utils/pickClass";
import "./link.css";

export interface LinkProps extends BoxProps {
  onClick?(e: MouseEvent): void;
}

export const Link = pickClass<LinkProps>(Box)("link");

Link.defaultProps = {
  as: "a",
};
