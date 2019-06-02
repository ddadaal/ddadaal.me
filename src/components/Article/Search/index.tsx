import React, { useRef, useState, useCallback } from "react";
import styled from "styled-components";
import TagsCard from "@/components/Cards/TagsCard";
import { breakpoints, colors } from "@/styles/variables";
import SearchBar from "@/components/Article/Search/SearchBar";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";
import CountedArticleTag from "@/components/Article/TagGroup/CountedArticleTag";
import { useEventListener } from "@/utils/useEventListener";
import TagDropdown from "@/components/Article/Search/TagDropdown";
import MediaQuery from "react-responsive";

interface Props {

}

const ArticleSearch: React.FC<Props> = (props) => {

  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEventListener(window, "click", (ev) => {
    if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
      setShow(false);
    }

  });

  const close = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <Container ref={containerRef}>
      <SearchBar onFocus={() => setShow(true)} />
      <MediaQuery maxWidth={breakpoints.md}>
        <TagDropdown onTagClicked={close} show={show} />
      </MediaQuery>
    </Container>
  );
};

const Container = styled.div`
  /* &:focus-within {
   .article-search__tags {
      display: block;
   }
  } */
`;



export default ArticleSearch;
