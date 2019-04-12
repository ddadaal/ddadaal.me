import React from "react";

import Contacts from "@/components/Contacts";
import { RootContainer, InnerContainer } from "@/layouts/LayeredLayout";
import bgImg from "~/assets/mainbg.jpg";
import lang from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import { FaFile, FaInfo, FaBookOpen, FaGithub, FaMailBulk, FaRegCommentDots, FaGlobe, FaMale } from "react-icons/fa";
import { Link } from "gatsby";
import { I18nStore } from "@/stores/I18nStore";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import styled, { keyframes } from "styled-components";
import moveInAnimation from "@/styles/moveInAnimation";
import HomeBg from "@/components/HomeBg";

interface Props {

}

const Bg = styled(RootContainer)`
  height: 100vh;

  background-image: url(${bgImg});

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;

`;

const Particles = styled(InnerContainer)`
  z-index: 2;
`;

const TextContent = styled(InnerContainer)`
  z-index: 3;
  color: white;
  text-align: center;

  & > * {
     padding: 12px 0;
  }
    animation: ${moveInAnimation} 0.2s ease-in-out;

`;

const TitleText = styled.h1`

`;

const Slogan = styled.h4`
`;

const LinkContainer = styled.div`

  & > * {
    margin: 4px;
  }
`;

const root = lang.homepage;

export default function HomePage(props: Props) {

  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  const getArticleLink = (id: string) => {
    return metadataStore.getArticleOfLang(id, i18nStore.language).path;
  };

  return (
    <HeaderFooterLayout transparentHeader={true}>
      <Bg>
        <Particles>
          <HomeBg />
        </Particles>
        <TextContent>
          <TitleText><LocalizedString id={selectDate()}/></TitleText>
          <Slogan><LocalizedString id={root.from}/></Slogan>
          <LinkContainer>
            <Link className={"btn btn-info"} to={"/articles"}>
              <FaBookOpen/><LocalizedString id={root.links.articles}/>
            </Link>
            <Link className={"btn btn-info"} to={getArticleLink("resume")}>
              <FaFile/><LocalizedString id={root.links.resume}/>
            </Link>
            <Link className={"btn btn-info"} to={getArticleLink("about-me")}>
              <FaMale/><LocalizedString id={root.links.aboutMe}/>
            </Link>
            <Link className={"btn btn-info"} to={getArticleLink("about-project")}>
              <FaGlobe/><LocalizedString id={root.links.aboutProject}/>
            </Link>
            <Link className={"btn btn-info"} to={getArticleLink("feedback")}>
              <FaRegCommentDots/>
              <LocalizedString id={root.links.feedback}/>
            </Link>
          </LinkContainer>
          <Contacts size={1.6} color={"white"}/>
        </TextContent>
      </Bg>
    </HeaderFooterLayout>
  );
}

function selectDate(): string {
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 11) {
    return root.morning;
  } else if (hour >= 12 && hour <= 17) {
    return root.afternoon;
  } else {
    return root.evening;
  }
}
