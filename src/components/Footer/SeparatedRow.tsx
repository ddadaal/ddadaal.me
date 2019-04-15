import React, { Children, PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  separator: ReactNode;
}

const Container = styled.p`
   text-align: center;
`;

export default function SeparatedRow({ children, separator }: PropsWithChildren<Props>) {

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
