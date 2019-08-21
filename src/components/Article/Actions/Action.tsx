import React, { PropsWithChildren, forwardRef } from "react";
import styled from "styled-components";

interface Props {
  onClick?(): void;
  Icon: React.ComponentType;
  color?: string;
}

export default forwardRef<HTMLLIElement, PropsWithChildren<Props>>((props, ref) => {
  const { onClick, Icon, children, color } = props;
  return (
    <Item ref={ref} onClick={onClick} color={color}>

      <Icon />
      <span>
        {children}
      </span>
    </Item>
  );
});

const Item = styled.li<{ color?: string }>`

  display: inline;
  padding: 12px 0;

  span {
    opacity: 0;
    transition: opacity 0.2s linear;
  }

  &:hover {
    cursor: pointer;

    span {
      opacity: 1;
    }
  }

  & > svg {
    width: 24px;
    height: 24px;
    fill: ${({ color }) => color};
  }
`;
