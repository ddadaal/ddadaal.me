import React, { useEffect } from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";
import GitalkComponent from "gitalk/dist/gitalk-component";
import { isServer } from "@/utils/isServer";
import { widths } from "@/styles/variables";

interface Props {
  articleId: string;
  articleTitle: string;
  language: string;
}

const CommentDiv = styled.div`
  margin-top: 32px;

  max-width: ${widths.articleContent}px;
  margin-left: auto;
  margin-right: auto;

  .gt-action-text {
    color: #6190e8;;
  }
`;

const root = lang.comments;

export default function CommentPanel(props: Props) {

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
              repo: "vicblog.github.io",
              owner: "vicblog",
              admin: ["viccrubs"],
              language: props.language,
              title: `${props.articleTitle} - VicBlog`,
              id: props.articleId.substring(0, 50),
              distractionFreeMode: false,
            }} />
          )
          : undefined
      }
    </CommentDiv>
  );
}
