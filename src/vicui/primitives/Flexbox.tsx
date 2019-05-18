import styled from "styled-components";
import { Box, BoxProps } from "./Box";
import {
    FlexWrapProps, FlexDirectionProps, AlignItemsProps, JustifyContentProps,
    flexWrap, flexDirection, alignItems, justifyContent,
} from "styled-system";

export interface FlexboxProps
extends BoxProps, FlexWrapProps, FlexDirectionProps, AlignItemsProps, JustifyContentProps { }

export const Flexbox = styled(Box)<FlexboxProps>({
  display: "flex",
},
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
);
