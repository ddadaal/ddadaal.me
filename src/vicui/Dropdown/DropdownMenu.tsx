import pickClass, { WrapperComponentProps } from "../utils/pickClass";
import styled from "styled-components";
import { Box, BoxProps } from "../primitives";

export interface DropdownMenuProps extends BoxProps {
  show?: boolean;
}

export const DropdownMenu = pickClass<DropdownMenuProps>(Box)("dropdown__menu", (props) => {
  return props.show ? "show" : undefined;
});

DropdownMenu.defaultProps = {
  show: true,
};
