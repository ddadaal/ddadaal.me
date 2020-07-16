import React from "react";
import { lang } from "@/i18n";
import { LocalizedString } from "simstate-i18n";
import styled, { keyframes } from "styled-components";
import { heights } from "@/styles/variables";
import "./style.scss";

interface Props {

}

const enter = keyframes`
  0% {
    top: 0;
  }
  100% {
    top: ${heights.header + 32}px;
  }
`;

const NewContentPopContainer = styled.div`
  position: fixed;

  left: 50%;
  transform: translate(-50%, -50%);

  animation: ${enter} 0.3s forwards;
  z-index: 2000;
  background-color: white;
  padding: 8px;
  border: 1px solid gray;
  border-radius: 16px;

  display: none;
`;

const root = lang.newContentPop;

const NewContentPop: React.FC<Props> = () => {
  return (
    <NewContentPopContainer id={"new-content-pop"}>
      <a href="" onClick={() => location.reload()}>
        <LocalizedString id={root.refresh} />
      </a>
      <LocalizedString id={root.other} />
    </NewContentPopContainer>
  );
}

export default NewContentPop;
