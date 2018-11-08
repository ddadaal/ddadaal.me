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

      let gitalk = new Gitalk({
        clientID: "5640259688bc3d72b807",
        clientSecret: "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff",
        repo: "VicBlog-Gatsby-Comments",
        owner: "viccrubs",
        admin: ["viccrubs"],
        id: location.pathname,      // Ensure uniqueness and length less than 50
        distractionFreeMode: false,  // Facebook-like distraction free mode
      });

      gitalk.render("comments");
    } catch (e) {
console.log(e);
    }
  }

  render() {
    return <CommentDiv>
      {/* <span id={window.location.pathname} className="leancloud-visitors" data-flag-title={this.props.articleTitle}>
        <em className="post-meta-item-text">Read count: </em>
        <i className="leancloud-visitors-count">0</i>
      </span> */}
      <h3><FaComments/> Comments</h3>
      <div id={"comments"}/>
    </CommentDiv>;
  }
}
