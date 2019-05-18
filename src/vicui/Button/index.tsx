import styled from "styled-components";
import {
  fontWeight,
  borders,
  borderColor,
  borderRadius,
  FontWeightProps,
  BordersProps,
  BorderColorProps,
  BorderRadiusProps,
} from "styled-system";
import pickClass from "../utils/pickClass";
import VariantProps from "../utils/variant";
import { BoxProps, Box } from "../primitives";
import "./button.css";

export interface ButtonProps extends BoxProps, FontWeightProps, BordersProps, BorderColorProps, BorderRadiusProps,
  VariantProps<"default" | "primary"> {
    onClick?(e: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export const Button = pickClass<ButtonProps>(styled(Box) <ButtonProps>`

  && {
    ${fontWeight}
    ${borders}
    ${borderColor}
    ${borderRadius}
  }

`)("btn", (props) => {
  return props.variant;
});

Button.defaultProps = {
  as: "button",
  variant: "default",
  p: 2,
};
