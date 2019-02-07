import React from "react";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import { FaShare } from "react-icons/fa";

interface Props {
  articleId: string;
}

const root = lang.articlePage.share;

export default function Share(props: Props) {
  return (
    <p>
      <h3>
        <FaShare />
        <LocalizedString id={root.title} />
      </h3>
    </p>
  );
}
