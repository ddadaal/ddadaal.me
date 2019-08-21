import React, { Children, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  separator: ReactNode;
}

const Container = styled.p`
   text-align: center;
`;

const SeparatedRow: React.FC<Props> = ({ children, separator }) => {

  const childrenArray = Children.toArray(children);

  const separatedArray = [] as ReactNode[];

  for (const obj of childrenArray) {
    separatedArray.push(obj);
    separatedArray.push(separator);
  }

  separatedArray.pop();

  return (
    <Container>
      {separatedArray}
    </Container>
  );
}

export default SeparatedRow;
