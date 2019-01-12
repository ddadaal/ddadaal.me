import * as React from "react";
import lang from "@/i18n/lang";
import I18nString from "@/i18n/I18nString";

import "./style.scss";

interface Props {

}

const root = lang.newContentPop;

export default function NewContentPop(props: Props) {
  return (
    <div className="newcontentpop no-display">
      <a href="" onClick={() => location.reload()}>
        <I18nString id={root.refresh} />
      </a>
      <I18nString id={root.other} />
    </div>
  );
}
