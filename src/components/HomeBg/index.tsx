import React, { useRef, useEffect, useState } from "react";
import bgImg from "~/assets/mainbg.jpg";
import styled from "styled-components";
import { InnerContainer, RootContainer } from "@/layouts/LayeredLayout";

const Container = styled(RootContainer)`
  height: 100vh;

`;

const REVEAL_RADIUS = 30;

const Bg = styled(InnerContainer)`
  background-image: url(${bgImg});
  
  height: 100vh;

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  
  filter: blur(5px);
  transform: scale(1.05);
`;

const RevealDiv = styled.div`
  position: absolute;
  background-image: url(${bgImg});
  background-color: white;
  background-repeat: no-repeat;
  width: ${REVEAL_RADIUS * 2}px;
  height: ${REVEAL_RADIUS * 2}px;
  /*making div circular*/
  border-radius: 50%;
    transform: scale(1.05);

  
`;

export default function HomeBg() {

  const divRef = useRef<HTMLDivElement>(null);
  const revealDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    const revealDiv = revealDivRef.current!!;
    const div = divRef.current!!;

    const bgtHalfW = div.clientWidth / 2;
    const bgtHalfH = div.clientHeight / 2;

    const mouseMove = (e: MouseEvent) => {
      e.preventDefault();
      revealDiv.classList.add("show");

      const scrollLeftPos = div.scrollLeft;
      const scrollTopPos = div.scrollTop;
      const offsetLeft = div.offsetLeft;
      const offsetTop = div.offsetTop;
      const upX = e.clientX;
      const upY = e.clientY;

      revealDiv.style.top = `${upY - REVEAL_RADIUS}px`;
      revealDiv.style.left = `${upX - REVEAL_RADIUS}px`;
      revealDiv.style.backgroundPosition = `${upX - REVEAL_RADIUS}px ${upY - REVEAL_RADIUS}px`


    };

    const mouseOut = () => {
      revealDiv.classList.remove("show");
    };

    div.addEventListener("mousemove", mouseMove);
    div.addEventListener("mouseout", mouseOut);

    return () => {
      div.removeEventListener("mousemove", mouseMove);
      div.removeEventListener("mouseout", mouseOut);

    };

  }, []);

  return (
    <Container ref={divRef}>
      <Bg />
      <RevealDiv ref={revealDivRef}/>
    </Container>
  );
}
