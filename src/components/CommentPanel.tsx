import * as React from "react";

import AV from "leancloud-storage";
import Valine from "valine";

import styled from "styled-components";
import { FaComments } from "react-icons/fa";


(window as any).AV = AV;

interface Props {
  articleId: string;
  articleTitle: string;
}

const CommentDiv = styled.div`
  * {
  color: white;
  }
  
`;

export default class CommentPanel extends React.Component<Props, {}> {

  componentDidMount() {
    new Valine({
      el: "#comments",
      appId: "oMlt3jv4JM9nVzqp9NmgGY4y-gzGzoHsz",
      appKey: "2n07rc1RaX7SkzQlyivB5LFR",
      notify: false,
      verify: false,
      avatar: "mm",
      placeholder: "just go go",
      visitor: true,
      highlight: true,
    });
  }

  render() {
    return <CommentDiv>
      <span id={window.location.pathname} className="leancloud-visitors" data-flag-title={this.props.articleTitle}>
        <em className="post-meta-item-text">Read count: </em>
        <i className="leancloud-visitors-count">0</i>
      </span>
      <h3><FaComments/> Comments</h3>
      <div id={"comments"}/>
    </CommentDiv>;
  }
}
