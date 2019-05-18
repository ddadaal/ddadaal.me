import React from "react";
import { BoxProps, Box } from "../primitives";
import pickClass from "../utils/pickClass";
import "./navbar.css";

export interface NavbarProps extends BoxProps  {

}

export const Navbar = pickClass<NavbarProps>(Box)("navbar");

Navbar.defaultProps = {
  as: "a",
};
