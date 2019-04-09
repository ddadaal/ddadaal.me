import React from "react";
import Page from "@/layouts/components/Page";

import styled from "styled-components";
import { colors, heights } from "@/styles/variables";
import Contacts from "@/components/Contacts";
import { RootContainer, InnerContainer } from "@/layouts/LayeredLayout";
import Particles from "@/components/Particles";
import bgImg from "~/assets/mainbg.jpg";

interface Props {

}

const titleHeight = 400;

const Title = styled(RootContainer)`
  height: ${titleHeight}px;
`;

const ImgContainer = styled(InnerContainer)`
  height: ${titleHeight}px;
  width: 100%;
  z-index: 1;
  overflow: auto;

  img {
    width: 100%;
  }
`;

const ParticlesContainer = styled(InnerContainer)`

  height: 100%;
  z-index: 2;
`;

const TextContent = styled(InnerContainer)`
  z-index: 3;
  color: white;
  text-align: center;

  margin-top: 56px;
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
        <ImgContainer>
          <img src={bgImg} />
        </ImgContainer>
        <ParticlesContainer>
          <Particles marginTop={heights.header}
                     height={titleHeight}
          />
        </ParticlesContainer>
        <TextContent>
          <TitleText>Hello</TitleText>
          <Slogan>from a Student | Programmer | Dreamer</Slogan>
          <Contacts color={"white"} size={1.4}/>
        </TextContent>
      </Title>
    </div>
  );
}
