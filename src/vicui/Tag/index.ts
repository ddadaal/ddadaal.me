import { Box, BoxProps } from "../primitives";
import pickClass from "../utils/pickClass";
import VariantProps from "../utils/variant";
import "./tag.css";

export interface TagProps extends BoxProps, VariantProps<"normal" | "info"> {
  onClick?(): void;
}

export const Tag = pickClass<TagProps>(Box)("tag", (props) => props.variant);

Tag.defaultProps = {
  variant: "normal",
  fontSize: 0,
  p: 1,
  as: "span",
};
