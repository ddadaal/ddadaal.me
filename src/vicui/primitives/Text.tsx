import {
  fontFamily, fontWeight, textAlign, lineHeight, letterSpacing,
  FontFamilyProps, FontWeightProps, TextAlignProps, LineHeightProps, LetterSpacingProps,
} from "styled-system";
import styled from "styled-components";
import { Box } from "./Box";

export interface TextProps extends
  FontFamilyProps, FontWeightProps, TextAlignProps, LineHeightProps, LetterSpacingProps {

}

export const Text = styled(Box)(
  fontFamily,
  fontWeight,
  textAlign,
  lineHeight,
  letterSpacing,
);
