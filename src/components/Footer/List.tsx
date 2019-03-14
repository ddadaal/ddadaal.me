import React from "react";
import styled from "styled-components";

interface Props {
  links: { name: string; link: string; }[];
}

const Ul = styled.ul`
  list-style: none;
  padding-left: 0px;
`;

const Li = styled.li`
  padding-bottom: 4px;
`;

export default function List({ links }: Props) {
  return (
    <Ul>
      {links.map(({ name, link }) => (
        <Li key={name}>
          <a href={link}>
            {name}
          </a>
        </Li>
      ))}
    </Ul>
  );
}
