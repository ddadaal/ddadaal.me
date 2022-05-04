import { Link } from "gatsby";
import React from "react";
import { FaCode, FaRegCommentDots,FaRss } from "react-icons/fa";
import { CardBody, CardText } from "reactstrap";
import styled from "styled-components";

import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import { Localized, prefix, useI18n } from "@/i18n";
import { useArticleOfCurrentLang } from "@/stores/useArticleOfCurrentLang";

const BlockContainer = styled.div`
  a {
    display: block;
  }
`;

interface Props {

}

const root = prefix("blogIntro.");

const BlogIntroCard: React.FC<Props> = () => {
  const aboutProjectPath = useArticleOfCurrentLang("about-project").path;

  const { translate } = useI18n();

  const moreText = translate(root("more")) as string;

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>💻 ddadaal.me | <Localized id={root("subtitle")} /></span>

        <Link
          className="card-link"
          to={aboutProjectPath}
          title={moreText}
        >
          <Localized id={root("moreLink")} />
        </Link>
      </BaseCardHeader>
      <CardBody>
        <CardText>
          <Localized id={root("description1")} />
        </CardText>
        <CardText>
          <Localized id={root("description2")} />
        </CardText>
        <BlockContainer>
          <a href="https://github.com/ddadaal/ddadaal.me" target="__blank">
            <FaCode />
            <Localized id={root("sourceCode")} />
          </a>
          <a href="/rss.xml" target="__blank">
            <FaRss />
            RSS
          </a>
          <Link to="/feedback">
            <FaRegCommentDots />
            <Localized id={root("feedback")} />
          </Link>
        </BlockContainer>
      </CardBody>
    </BaseCard >
  );
};

export default BlogIntroCard;
