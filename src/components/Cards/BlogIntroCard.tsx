import React from "react";
import { CardBody, CardLink, CardText } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots } from "react-icons/fa";
import { Link } from "gatsby";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

import { BaseCard, BaseCardHeader } from "@/components/Cards/components";
import { useArticleOfCurrentLang } from "@/stores/useArticleOfCurrentLang";
import useLocalized from "@/i18n/useLocalize";
import styled from "styled-components";

const BlockContainer = styled.div`
  a {
    display: block;
  }
`;

interface Props {

}

const root = lang.blogIntro;

const BlogIntroCard: React.FC<Props> = () => {
  const aboutProjectPath = useArticleOfCurrentLang("about-project").path;
  const moreText = useLocalized(root.more) as string;

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>💻 VicBlog <LocalizedString id={root.subtitle} /></span>

        <Link
          className="card-link"
          to={aboutProjectPath}
          title={moreText}
        >
          <LocalizedString id={root.moreLink} />
        </Link>
      </BaseCardHeader>
      <CardBody>
        <CardText>
          <LocalizedString id={root.description1} />
        </CardText>
        <CardText>
          <LocalizedString id={root.description2} />
        </CardText>
        <BlockContainer>
          <a href="https://github.com/viccrubs/VicBlog-Gatsby" target="__blank">
            <FaCode />
            <LocalizedString id={root.sourceCode} />
          </a>
          <Link to="/rss.xml" target="__blank">
            <FaRss />
            RSS
          </Link>
          <Link to="/feedback">
            <FaRegCommentDots />
            <LocalizedString id={root.feedback} />
          </Link>
        </BlockContainer>
      </CardBody>
    </BaseCard >
  );
}

export default BlogIntroCard;
