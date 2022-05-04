import React, { useCallback,useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import styled from "styled-components";

interface DivProps {
  visible: boolean;
}

const Div = styled.div`
  position: fixed;
  bottom: 36px;
  right: 36px;

  z-index: 2000;



  ${({ visible }: DivProps) => visible ? `
    :hover {
      cursor: pointer;
    }
  ` : `
    opacity: 0;
  `};

  transition: opacity 0.2s ease-in-out;



  svg {
    width: 36px;
    height: 36px;
  }
`;

const ToTop: React.FC = () => {

  const [visible, setVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const handler = (): void => {
      setVisible(window.scrollY > 0);
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, []);

  return (
    <Div visible={visible} onClick={scrollToTop}>
      <FaArrowUp />
    </Div>
  );
};

export default ToTop;
