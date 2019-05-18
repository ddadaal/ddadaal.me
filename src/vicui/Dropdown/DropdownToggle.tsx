import pickClass from "../utils/pickClass";
import { Box, BoxProps } from "../primitives";
import styled from "styled-components";
import { ButtonProps } from "@/vicui";
import { Button } from "@/vicui";

export interface DropdownToggleProps extends ButtonProps {
}

export const DropdownToggle = pickClass<DropdownToggleProps>(Button)("dropdown__toggle");

DropdownToggle.defaultProps = {

};
