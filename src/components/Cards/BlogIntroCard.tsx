import React from "react";
import { Card, CardBody, CardLink, CardSubtitle, CardText, CardTitle } from "reactstrap";
import { FaCode, FaRss, FaRegCommentDots, FaGlobe, FaEllipsisH } from "react-icons/fa";
import { Link } from "gatsby";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

import { MetadataStore } from "@/stores/MetadataStore";
import { I18nStore } from "@/stores/I18nStore";
import { useStore } from "simstate";
import { BaseCard, BaseCardHeader } from "@/components/Cards/components";

interface Props {

}

const root = lang.blogIntro;

export default function BlogIntroCard(props: Props) {

  const i18nStore = useStore(I18nStore);
  const metadataStore = useStore(MetadataStore);

  return (
    <BaseCard>
      <BaseCardHeader>
        <span>💻 VicBlog <LocalizedString id={root.subtitle} /></span>
        <Link
          className="card-link"
          to={metadataStore.getArticleOfLang("about-project", i18nStore.state.language).path}
          title={i18nStore.language.definitions.blogIntro.more}
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
        <CardLink href="https://github.com/viccrubs/VicBlog-Gatsby">
          <FaCode />
          <LocalizedString id={root.sourceCode} />
        </CardLink>
        <CardLink href="/rss.xml">
          <FaRss />
          RSS
          </CardLink>
        <Link
          className="card-link"
          to={metadataStore.getArticleOfLang("feedback", i18nStore.state.language).path}
        >
          <FaRegCommentDots />
          <LocalizedString id={root.feedback} />
        </Link>
      </CardBody>
    </BaseCard>
  );
}
