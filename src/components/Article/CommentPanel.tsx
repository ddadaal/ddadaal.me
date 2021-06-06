import React, { useEffect } from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";
import { useI18n, Localized, languageInfo } from "@/i18n";
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
        <Localized id="comments.title" />
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
              // eslint-disable-next-line max-len
              proxy: "https://fierce-chamber-01587.herokuapp.com/https://github.com/login/oauth/access_token",
            }}
            />
          )
          : undefined
      }
    </CommentDiv>
  );
};

const CommentPanelWithCurrentLanguage: React.FC<Omit<Props, "language">> = (props) => {
  const i18n = useI18n();

  return (
    <CommentPanel
      {...props}
      language={languageInfo[i18n.currentLanguage.id].gitalkLangId
        ?? languageInfo.cn.gitalkLangId}
    />
  );
};

export { CommentPanel as default, CommentPanelWithCurrentLanguage };
