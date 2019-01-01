import * as React from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";
import I18nString from "@/i18n/I18nString";
import lang from "@/i18n/lang";

interface Props {
  articleId: string;
  articleTitle: string;
  language: string;
}

interface State {
  mount: boolean;
}

const CommentDiv = styled.div`
  .gt-action-text {
    color: #6190e8;;
  }
`;

class RealCommentPanel extends React.Component<Props, {}> {
  componentDidMount() {
    this.renderGitalk();
  }

  async renderGitalk() {
    try {

      const Gitalk = (await import("gitalk")).default;

      const gitalk = new Gitalk({
        clientID: "5640259688bc3d72b807",
        clientSecret: "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff",
        repo: "viccrubs.github.io",
        owner: "viccrubs",
        admin: ["viccrubs"],
        language: this.props.language,
        id: this.props.articleId,
        distractionFreeMode: false,
      });

      gitalk.render("comments");
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <CommentDiv>
        <div id={"comments"} />
      </CommentDiv>
    );
  }
}

const root = lang.comments;

export default class CommentPanel extends React.Component<Props, State> {
  state = {
    mount: true,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.language !== this.props.language) {
      this.setState({ mount: false }, () => {
        this.setState({ mount: true });
      });
    }

  }

  render() {
    return (
      <CommentDiv>
        <h3>
          <FaComments />
          <I18nString id={root.title} />
        </h3>
        {
          this.state.mount
            ? <RealCommentPanel {...this.props} />
            : undefined
        }
      </CommentDiv>
    );
  }
}
