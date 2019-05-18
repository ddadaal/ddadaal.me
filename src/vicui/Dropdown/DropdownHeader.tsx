import pickClass, { WrapperComponentProps } from "../utils/pickClass";
import styled from "styled-components";
import { Box, BoxProps } from "../primitives";

export interface DropdownHeaderProps extends BoxProps {

}

export const DropdownHeader = pickClass<DropdownHeaderProps>(Box)("dropdown__header");

DropdownHeader.defaultProps = {
  as: "h6",
};
