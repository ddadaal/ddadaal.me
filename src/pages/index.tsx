import React from "react";

import Contacts from "@/components/Contacts";
import { RootContainer, InnerContainer } from "@/layouts/LayeredLayout";
import bgImg from "~/assets/mainbg.jpg";
import { lang, useI18nStore } from "@/i18n";
import { LocalizedString } from "simstate-i18n";
import { FaFile, FaBookOpen, FaMale, FaClock, FaSlideshare, FaRss } from "react-icons/fa";
import { Link } from "gatsby";
import { useStore } from "simstate";
import MetadataStore from "@/stores/MetadataStore";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import styled from "styled-components";
import { colors } from "@/styles/variables";
import moveInAnimation from "@/styles/moveInAnimation";
import { PageMetadata } from "@/components/PageMetadata";

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

  margin: 0 8px;


`;


const TitleText = styled.h1`

`;

const Slogan = styled.h4`
  font-size: 20px;
`;

const LinkContainer = styled.div`

  & > * {
    margin: 4px;
  }
`;

const root = lang.homepage;

const Button: React.FC<{ to: string; mode?: "to" | "href" }> = ({
  to,
  mode = "to", children,
}) => {

  const metadataStore = useStore(MetadataStore);
  const i18nStore = useI18nStore();

  const commonProps = {
    className: "btn btn-info",
    key: to,
  };

  if (mode === "to") {
    return (
      <Link {...commonProps} to={to.startsWith("/")
        ? to
        : metadataStore.getArticleOfLang(to, i18nStore.currentLanguage.id).path
      }
      >
        {children}
      </Link>
    );
  } else {
    return (
      <a {...commonProps} href={to}>
        {children}
      </a>
    );
  }
};


const links = [
  ["/rss.xml", FaRss, root.links.rss, "href"],
  ["resume", FaFile, root.links.resume],
  ["/slides", FaSlideshare, root.links.slides],
  ["about-me", FaMale, root.links.aboutMe],
] as const;

const HomePage: React.FunctionComponent = () => {

  const metadataStore = useStore(MetadataStore);

  return (
    <HeaderFooterLayout transparentHeader={true}>
      <PageMetadata
        titleId={lang.pageMedatadata.homepage}
      />
      <Bg>
        <TextContent>
          <TitleText>
            <LocalizedString id={root.hello} />
          </TitleText>
          <Slogan><LocalizedString id={root.from} /></Slogan>
          <LinkContainer>
            <Button to="/articles">
              <FaBookOpen />
              <LocalizedString
                id={root.links.articles}
                replacements={[metadataStore.articleCount]}
              />
            </Button>
            {links.map(([to, Icon, id, mode = "to"]) => (
              <Button key={to} to={to} mode={mode as "href" | "to"}>
                <Icon />
                <LocalizedString id={id} />
              </Button>
            ))}
          </LinkContainer>
          <Contacts size={1.6} color={"white"} />
          <p>
            <FaClock />
            <LocalizedString id={lang.statistics.lastUpdated} />：
            <strong> {metadataStore.siteMetadata.formattedLastUpdate}</strong>
          </p>
        </TextContent>

      </Bg>
    </HeaderFooterLayout >
  );
};

export default HomePage;
