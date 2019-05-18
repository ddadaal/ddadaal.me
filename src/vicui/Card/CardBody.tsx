import styled from "styled-components";
import pickClass, { WrapperComponentProps } from "../utils/pickClass";
import { Box, BoxProps } from "../primitives";

export interface CardBodyProps extends BoxProps {

}

export const CardBody = pickClass<CardBodyProps>(Box)("card__body");

CardBody.defaultProps = {
  p: 3,
};
