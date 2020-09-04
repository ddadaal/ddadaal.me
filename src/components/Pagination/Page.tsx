import React from "react";
import { Box, Anchor, Text } from "grommet";
import { AnchorLink } from "../AnchorLink";
import { UrlObject } from "url";

interface Props {
  pageNumber: number;
  text: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  href?: UrlObject | string;
  onClick?: (pageNumber: number) => void;
}

export const PageLink: React.FC<Props> = ({
  pageNumber,
  text,
  active,
  disabled,
  href,
  onClick,
}) => {

  return (
    <Box
      pad="small"
      focusIndicator={true}
    >
      <AnchorLink
        disabled={disabled}
        href={href}
        onClick={onClick ? () => onClick(pageNumber) : undefined}
      >
        <Text weight={active ? "bold" : "normal"}>
          {text}
        </Text>
      </AnchorLink>
    </Box>
  );
};
