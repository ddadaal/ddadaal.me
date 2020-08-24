import React from "react";
import styled from "styled-components";

interface Props {
  children?: React.ReactNode;
}

const Resume = styled.div`

  && {
    line-height: 26px;

    body {
      line-height: 18px;
    }

    h1, h2, h3 {
      line-height: 18px;

    }
    h1 {
      font-size: 20px;
      margin: 12px 0;
    }
    h2 {
      font-size: 16px;
      margin: 4px 0;
    }
    h2 .highlight {
      font-weight: 700;
      font-size: 18px;
    }

    h3{
      line-height: 16px;
      font-size: 14px;
      margin: 1px 0;
    }
    ul {
      margin: 0px;
    }
    p {
      margin: 0px;
    }
    .right { float: right}
    .contact {
      margin: 20px 0;
      text-align: center;
    }
    .name {
      font-size: 36px;
      border-bottom: none;
      padding: 0;
      margin: 20px 0px;
      text-align: center;
    }
  }


`;

const ResumeLayout: React.FC<Props> = (props: Props) => {
  return (
    <Resume>
      {props.children}
    </Resume>
  );
}

export default ResumeLayout;
