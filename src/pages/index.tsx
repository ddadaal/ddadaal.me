import React from "react";
import Page from "@/layouts/components/Page";

import styled from "styled-components";
import { colors } from "@/styles/variables";
import Contacts from "@/components/Contacts";

interface Props {

}

const Title = styled.div`
  height: 400px;
  //background-color: ${colors.headerBg};
  
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const TextContent = styled.div`
  text-align: center;
  padding: 24px;
`;

const TitleText = styled.h1`
   padding: 12px 0;
   
`;

const Slogan = styled.h4`
  padding: 12px 0;
`;

export default function HomePage(props: Props) {
  return (
    <div>
      <Title>
        <TextContent>
          <TitleText>Hello</TitleText>
          <Slogan>from a Student | Programmer | Dreamer</Slogan>
          <Contacts color={"black"} size={1.4}/>

        </TextContent>
      </Title>
    </div>
  );
}
