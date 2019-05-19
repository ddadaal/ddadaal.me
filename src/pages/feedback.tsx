import React from "react";
import Page from "@/layouts/Page";
import BannerLayout from "@/layouts/BannerLayout";
import lang from "@/i18n/lang";
import LocalizedString from "@/i18n/LocalizedString";
import Contacts from "@/components/Contacts";
import CommentPanel, { CommentPanelWithCurrentLanguage } from "@/components/Article/CommentPanel";
import { useStore } from "simstate";
import { I18nStore } from "@/stores/I18nStore";
import HeaderFooterLayout from "@/layouts/HeaderFooterLayout";

const root = lang.feedback;

export default function FeedbackPage() {

  return (
    <HeaderFooterLayout transparentHeader={false}>
      <Page>
        <BannerLayout.Title><LocalizedString id={root.title} /></BannerLayout.Title>
        <p><LocalizedString id={root.paragraph1} /></p>
        <p><LocalizedString id={root.paragraph2} /></p>
        <p><LocalizedString id={root.paragraph3} /></p>
        <Contacts color={"black"} size={1.4} />
        <CommentPanelWithCurrentLanguage articleId="feedback" articleTitle="反馈" />
      </Page>
    </HeaderFooterLayout>

  );
}
