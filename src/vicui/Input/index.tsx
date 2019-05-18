import { Box, BoxProps } from "../primitives";
import pickClass from "../utils/pickClass";
import "./input.css";

interface InputProps extends BoxProps {

}

export const Input = pickClass<InputProps>(Box)("input");

Input.defaultProps = {
  as: "input",
  p: 2,
};
