import React from "react";
import Page from "@/layouts/Page";
import { BannerLayoutTitle } from "@/layouts/BannerLayout";
import { Localized, prefix } from "@/i18n";
import Contacts from "@/components/Contacts";
import { CommentPanelWithCurrentLanguage } from "@/components/Article/CommentPanel";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";
import { PageMetadata } from "@/components/PageMetadata";

const root = prefix("feedback.");

const FeedbackPage: React.FC = () => {

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <PageMetadata
        titleId={root("title")}
      />
      <Page>
        <BannerLayoutTitle><Localized id={root("title")} /></BannerLayoutTitle>
        <p><Localized id={root("paragraph1")} /></p>
        <p><Localized id={root("paragraph2")} /></p>
        <p><Localized id={root("paragraph3")} /></p>
        <Contacts color={"white"} size={1.4} />
        <CommentPanelWithCurrentLanguage articleId="feedback" articleTitle="反馈" />
      </Page>
    </HeaderFooterLayout>

  );
};

export default FeedbackPage;
