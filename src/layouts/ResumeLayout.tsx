import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const Resume = styled.div`

  h1, h2, h3 {
    border-bottom-width: 0 !important;
    /* margin: 8px 0; */

    border-left: none;

    padding-left: 0px;
  }

  h1 {
    font-size: 24px;
    margin: 12px 0;
    padding-bottom: 0.3em;
    border-bottom-width: 1px !important;
    border-bottom-style: solid;
  }
  h2 {
    font-size: 20px;

  }

  h3 {
    font-size: 16px;

  }
  ul {
    margin: 0px;
  }
  p {
    margin: 0px;
  }
  .right {
    float: right;
  }
  .contact {
    margin: 20px 0;
    text-align: center;
  }
  .name {
    font-size: 36px;
    border-bottom: none;
    padding: 0;
    text-align: center;
  }
  .avatar {
    float: right;
    height: 100px;
    margin: 0px;
  }
`;

export default function ResumeLayout(props: Props) {
  return (
    <Resume>
      {props.children}
    </Resume>
  );
}
