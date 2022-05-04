import React from "react";
import styled from "styled-components";

import { Localized } from "@/i18n";

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
