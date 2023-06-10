"use client";

import { CommentPanelWithCurrentLanguage } from "src/components/article/CommentPanel";
import { Contacts } from "src/components/Contacts";
import { Localized } from "src/i18n";

export default function Feedback() {
  return (
    <div className="max-w-7xl mx-auto p-4 animate-slide-up">
      <div className="prose text-center max-w-none">
        <h1>
          <Localized id="feedback.title" />
        </h1>
        <p>
          <Localized id="feedback.paragraph1" />
        </p>
        <p>
          <Localized id="feedback.paragraph2" />
        </p>
        <p>
          <Localized id="feedback.paragraph3" />
        </p>
        <Contacts size={2} className="justify-center" />
      </div>
      <CommentPanelWithCurrentLanguage
        articleId="feedback"
        articleTitle="反馈"
      />
    </div>
  );


}
