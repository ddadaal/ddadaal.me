import * as React from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";
import LocalizedString from "@/i18n/LocalizedString";
import lang from "@/i18n/lang";

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
        repo: "vicblog.github.io",
        owner: "vicblog",
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
        <div id={"comments"} />
    );
  }
}

const root = lang.comments;

interface State {
  mount: boolean;
}


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
          <LocalizedString id={root.title} />
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
