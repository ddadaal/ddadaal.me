import React from "react";
import Page from "@/layouts/Page";
import { BannerLayoutTitle } from "@/layouts/BannerLayout";
import lang from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import Contacts from "@/components/Contacts";
import { CommentPanelWithCurrentLanguage } from "@/components/Article/CommentPanel";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import { PageMetadata } from "@/components/PageMetadata";

const root = lang.feedback;

const FeedbackPage: React.FC = () => {

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <PageMetadata
        titleId={root.title}
      />
      <Page>
        <BannerLayoutTitle><LocalizedString id={root.title} /></BannerLayoutTitle>
        <p><LocalizedString id={root.paragraph1} /></p>
        <p><LocalizedString id={root.paragraph2} /></p>
        <p><LocalizedString id={root.paragraph3} /></p>
        <Contacts color={"black"} size={1.4} />
        <CommentPanelWithCurrentLanguage articleId="feedback" articleTitle="反馈" />
      </Page>
    </HeaderFooterLayout>

  );
}

export default FeedbackPage;
