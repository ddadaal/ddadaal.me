import React from "react";

import Contacts from "@/components/Contacts";
import { RootContainer, InnerContainer } from "@/layouts/LayeredLayout";
import bgImg from "~/assets/mainbg.jpg";
import lang from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import { FaFile, FaBookOpen, FaRegCommentDots, FaMale, FaClock, FaSlideshare } from "react-icons/fa";
import { Link } from "gatsby";
import I18nStore from "@/stores/I18nStore";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import styled from "styled-components";
import { colors } from "@/styles/variables";
import moveInAnimation from "@/styles/moveInAnimation";

const Bg = styled(RootContainer)`
  height: 100vh;

  background-color: ${colors.homepageBgColor};
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

const links = [
  ["/articles", FaBookOpen, root.links.articles],
  ["resume", FaFile, root.links.resume],
  ["/slides", FaSlideshare, root.links.slides],
  ["about-me", FaMale, root.links.aboutMe],
  ["/feedback", FaRegCommentDots, root.links.feedback],
] as const;

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

const HomePage: React.FunctionComponent = () => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useStore(I18nStore);

  return (
    <HeaderFooterLayout transparentHeader={true}>
      <Bg>
        <TextContent>
          <TitleText><LocalizedString id={selectDate()} /></TitleText>
          <Slogan><LocalizedString id={root.from} /></Slogan>
          <LinkContainer>
            {links.map(([to, Icon, id]) => (
              <Link className={"btn btn-info"} key={to} to={
                to.startsWith("/")
                  ? to
                  : metadataStore.getArticleOfLang(to, i18nStore.language).path
              }>
                <Icon /><LocalizedString id={id} />
              </Link>
            ))}

          </LinkContainer>
          <Contacts size={1.6} color={"white"} />
          <p>
            <FaClock />
            <LocalizedString id={lang.statistics.lastUpdated} />：
            <strong> {metadataStore.lastUpdated}</strong>
          </p>
        </TextContent>

      </Bg>
    </HeaderFooterLayout>
  );
}

export default HomePage;
