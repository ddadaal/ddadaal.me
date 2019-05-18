import pickClass, { WrapperComponentProps } from "../utils/pickClass";
import styled from "styled-components";
import { Box, BoxProps } from "../primitives";

export interface DropdownItemProps extends BoxProps {
  active?: boolean;
  onClick?(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export const DropdownItem = pickClass<DropdownItemProps>(Box)("dropdown__item",
  (props) => props.active ? "active" : "");

DropdownItem.defaultProps = {
  as: "a",
  active: false,
};
