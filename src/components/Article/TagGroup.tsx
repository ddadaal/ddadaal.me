import * as React from "react";
import { Badge } from "reactstrap";
import styled from "styled-components";
import { navigate, Link } from "gatsby"
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import lang from "@/i18n/lang";

interface Props extends WithStoresProps {
  className?: string;
  tags: string[];
}

const MarginedBadge = styled(Badge)`
  margin-right: 4px;

  a {
    color: white;
  }
`

export default withStores(I18nStore)(function TagGroup(props: Props) {
  const i18nStore = props.useStore(I18nStore);

  const createTitle = (tag: string) =>
    i18nStore.translate(lang.articleFrontmatter.tagLinkTitle, [tag]) as string

  return (
    <>
      {
        props.tags.map((x) =>
          <MarginedBadge color={"info"} pill={true} key={x}>
            <Link to={`/search?query=${x}`} title={createTitle(x)}>
              {x}
            </Link>
          </MarginedBadge>
        )
      }
    </>
  );

});
