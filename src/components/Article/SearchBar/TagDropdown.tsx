import React from "react";
import useConstant from "@/utils/useConstant";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import CountedArticleTag from "@/components/Article/TagGroup/CountedArticleTag";
import styled from "styled-components";
import { colors } from "@/styles/variables";

interface Props {
  show: boolean;
  onTagClicked?(): void;
}

const TagDropdown: React.FC<Props> = (props) => {
  const metadataStore = useStore(MetadataStore);

  const tags = useConstant(() => {
    return Array.from(metadataStore.tagMap.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map((entry) => entry[0]);
  });

  return (
    <TagContainer show={props.show}>
      {tags.map((tag) => (
        <CountedArticleTag onClick={props.onTagClicked} key={tag} tag={tag} />
      ))}
    </TagContainer>
  );

};

const TagContainer = styled.div<{ show: boolean }>`
  border: 1px solid ${colors.lightGray};
  display: ${(props) => props.show ? "block" : "none"};
  padding: 8px;
`;

export default TagDropdown;
