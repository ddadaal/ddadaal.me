import React from "react";
import { LocalizedString } from "simstate-i18n";
import { lang } from "@/i18n";
import styled from "styled-components";

const root = lang;

const Container = styled.p`
    text-align: center;
`;

const MadeWithLove: React.FC = () => {
  return (
    <Container>
      © {new Date().getFullYear()} | <LocalizedString id={root.footer.madeWithLove} />
    </Container>
  );
}

export default MadeWithLove;
