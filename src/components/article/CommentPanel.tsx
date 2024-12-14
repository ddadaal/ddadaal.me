"use client";

import "gitalk/dist/gitalk.css";

// @ts-expect-error --no types
import GitalkComponent from "gitalk/dist/gitalk-component";
import React, { useEffect } from "react";
import { FaComments } from "react-icons/fa";
import { getLanguage, Localized, useI18n } from "src/i18n";

interface Props {
  articleId: string;
  articleTitle: string;
  language: string;
}

function isServer() {
  return typeof window === "undefined";
}

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
    <div>
      <h2 className="text-2xl font-bold mb-2 flex items-center">
        <FaComments />
        <span
          className="mx-2"
        >
          <Localized id="comments.title" />
        </span>
      </h2>
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

              // proxy: "https://ddadaal-me-cors.ddadaal.workers.dev/https://github.com/login/oauth/access_token",
              }}
              />
            )
          : undefined
      }
    </div>
  );
};

export const CommentPanelWithCurrentLanguage: React.FC<Omit<Props, "language">> = (props) => {
  const i18n = useI18n();

  const language = getLanguage(i18n.currentLanguage.id);

  return (
    <CommentPanel
      {...props}
      language={language.gitalkLangId}
    />
  );
};
