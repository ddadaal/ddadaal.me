import pickClass from "../utils/pickClass";
import { Box, BoxProps } from "../primitives";
import styled from "styled-components";

export interface DropdownDividerProps extends BoxProps {
}

export const DropdownDivider = pickClass<DropdownDividerProps>(Box)("dropdown__divider");

DropdownDivider.defaultProps = {

};
