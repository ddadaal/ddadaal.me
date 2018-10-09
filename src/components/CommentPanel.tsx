import * as React from "react";
import "gitment/style/default.css";
import Gitment from "gitment";
import styled from 'styled-components'
import { FaComments } from "react-icons/fa"

interface Props {
  articleId: string;
}

const CommentDiv = styled.div`
  * {
  color: white;
  }
  
  .gitment-footer-container {
  color: white;
  }
  
  .gitment-heart-icon {
    fill: red;
  }
  
  .gitment-editor-tab {
    color: white;
  }
  
  .gitment-editor-footer-tip {
    color: #7E94AC;
  }
`;

export default class CommentPanel extends React.Component<Props, {}> {

  componentDidMount() {
    const gitment = new Gitment({
      id: this.props.articleId, // optional
      owner: "viccrubs",
      repo: "VicBlog-Gatsby-Comments",
      oauth: {
        client_id: "5640259688bc3d72b807",
        client_secret: "bbe26de2fca2ea86e49a98e883caf9ff3102c4ff",
      },
      // ...
      // For more available options, check out the documentation below
    });

    gitment.render("comments");
  }

  render() {
    return <CommentDiv>
      <h3><FaComments/> Comments</h3>
      <div id={"comments"}/>
    </CommentDiv>;
  }
}
