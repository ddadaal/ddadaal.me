import React, { useState, useEffect, useRef } from "react";

import { FaLink } from "react-icons/fa";
import Action from "@/components/Article/Actions/Action";
import lang from "@/i18n/lang";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import LocalizedString from "@/i18n/LocalizedString";
import { useEventListener } from "@/utils/useEventListener";

const root = lang.articlePage.actions.copyLink;

interface Props {
  articleId: string;
}

export default function CopyLinkAction({ articleId }: Props) {

  const metadataStore = useStore(MetadataStore);

  const [ copied, setCopied ] = useState(false);

  const ref = useRef<HTMLLIElement>(null);

  useEventListener(ref, "mouseleave", () => {
    console.log("leave");
    setCopied(false);
  });

  return (
    <Action ref={ref} Icon={FaLink}
            onClick={() =>
              (navigator as any).clipboard.writeText(`${metadataStore.baseUrl}/articles/${articleId}`)
              .then(() => {
                setCopied(true);
              })
            }
    >
      <LocalizedString id={copied ? root.copied : root.copyLink}/>
    </Action>
  );
}
