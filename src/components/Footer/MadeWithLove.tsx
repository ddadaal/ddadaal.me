import React from "react";
import { Localized } from "@/i18n";
import styled from "styled-components";

const Container = styled.p`
    text-align: center;
`;

const MadeWithLove: React.FC = () => {
  return (
    <Container>
      © {new Date().getFullYear()} | <Localized id="footer.madeWithLove" />
    </Container>
  );
};

export default MadeWithLove;
