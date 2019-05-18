import React, { forwardRef, PropsWithChildren, useRef } from "react";
import pickClass from "../utils/pickClass";
import { Box, BoxProps } from "../primitives";
import { DropdownMenu } from "./DropdownMenu";

type MenuAlignment = "left" | "right";

export interface DropdownProps extends BoxProps {
  trigger: React.ReactNode;
  open?: boolean;
  className?: string;
  menuAlignment?: MenuAlignment;
}

export const Dropdown = pickClass<DropdownProps>(
  ({ children, open, trigger, ...props }) => {

    return (
      <Box
        {...props as any}
      >
        {trigger}
        <DropdownMenu show={open}>
          {children}
        </DropdownMenu>
      </Box>
    );
  })("dropdown");

Dropdown.defaultProps = {
  open: false,
  menuAlignment: "left",
};
