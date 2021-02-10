import styled from "styled-components";
import { colors, breakpoints, heights } from "@/styles/variables";

const Placeholder = styled.div<{ isOpen: boolean; transparent: boolean }>`

  background-color: ${colors.headerBg};
  height: ${({ isOpen, transparent }) =>
    isOpen ? 300 : transparent ? 0 : heights.header}px;

  @media (max-width: ${breakpoints.md}px) {
    transition: height 0.3s ease-in-out;

  }

  @media (min-width: ${breakpoints.md}px) {
    height: ${({ transparent }) => transparent ? 0 : heights.header}px;
  }
`;

export default Placeholder;
