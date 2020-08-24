import React, { useEffect } from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";
import { LocalizedString } from "simstate-i18n";
import { lang, cn, useI18nStore } from "@/i18n";
import GitalkComponent from "gitalk/dist/gitalk-component";
import isServer from "@/utils/isServer";

interface Props {
  articleId: string;
  articleTitle: string;
  language: string;
}

const CommentDiv = styled.div`
  margin-top: 32px;

  .gt-action-text {
    color: #6190e8;;
  }
`;

const root = lang.comments;

const CommentPanel: React.FC<Props> = (props) => {

  const [mount, setMount] = React.useState(!isServer());

  const firstUpdate = React.useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    setMount(false);
  }, [props.language]);

  useEffect(() => {
    if (!isServer() && !mount) {
      setMount(true);
    }
  });

  return (
    <CommentDiv>
      <h3>
        <FaComments />
        <LocalizedString id={root.title} />
      </h3>
      {
        mount
          ? (
            <GitalkComponent options={{
              clientID: "5640259688bc3d72b807",
              clientSecret: "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff",
              repo: "ddadaal.me.github.io",
              owner: "ddadaal",
              admin: ["ddadaal"],
              language: props.language,
              title: `[COMMENT] ${props.articleTitle}`,
              id: props.articleId.substring(0, 50),
              distractionFreeMode: false,
            }} />
          )
          : undefined
      }
    </CommentDiv>
  );
};

const CommentPanelWithCurrentLanguage: React.FC<Omit<Props, "language">> = (props) => {
  const i18nStore = useI18nStore();

  return <CommentPanel {...props} language={i18nStore.currentLanguage.gitalkLangId ?? cn.gitalkLangId} />;
}

export { CommentPanel as default, CommentPanelWithCurrentLanguage };
