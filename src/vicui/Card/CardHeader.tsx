import { Box, BoxProps } from "../primitives";
import pickClass from "../utils/pickClass";

export interface CardHeaderProps extends BoxProps {

}

export const CardHeader = pickClass<CardHeaderProps>(Box)("card__header");

CardHeader.defaultProps = {
  px: 3,
  py: 2,
};
