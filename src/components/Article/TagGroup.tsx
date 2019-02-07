import React from "react";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { navigate, Link } from "gatsby";

import { I18nStore } from "@/stores/I18nStore";
import lang from "@/i18n/lang";
import Localize from "@/i18n/Localize";

interface Props {
  className?: string;
  tags: string[];
}

const MarginedBadge = styled(Badge)`
  margin-right: 4px;

  a {
    color: white;
  }
`;

export default function TagGroup(props: Props) {

  return (
    <>
      {
        props.tags.map((tag) =>
          <Localize key={tag} id={lang.articleFrontmatter.tagLinkTitle} replacements={[tag]}>
            {(localizedTitle) => (
              <MarginedBadge color={"info"} pill={true} key={tag}>
                <Link to={`/search?query=${tag}`} title={localizedTitle}>
                  {tag}
                </Link>
              </MarginedBadge>
            )}
          </Localize>,
        )
      }
    </>
  );

}
