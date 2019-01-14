import * as React from "react";
import I18nString from "@/i18n/I18nString";
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
        <I18nString id={root.title} />
      </h3>
    </p>
  )
}