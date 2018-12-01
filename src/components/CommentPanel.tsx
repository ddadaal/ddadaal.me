import * as React from "react";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";

import "gitalk/dist/gitalk.css";

interface Props {
  articleId: string;
  articleTitle: string;
}

const CommentDiv = styled.div`
  .gt-action-text {
    color: #6190e8;;
  }
`;

export default class CommentPanel extends React.Component<Props, {}> {

  async componentDidMount() {
    try {

      const Gitalk = (await import("gitalk")).default;

      const gitalk = new Gitalk({
        clientID: "5640259688bc3d72b807",
        clientSecret: "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff",
        repo: "viccrubs.github.io",
        owner: "viccrubs",
        admin: ["viccrubs"],
        language: "en",
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
        <h3><FaComments/> Comments</h3>
        <div id={"comments"}/>
      </CommentDiv>
    );
  }
}
