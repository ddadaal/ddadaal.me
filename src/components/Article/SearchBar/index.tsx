import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import SearchBar from "@/components/Article/SearchBar/SearchBar";
import TagDropdown from "@/components/Article/SearchBar/TagDropdown";
import isServer from "@/utils/isServer";
import { useEventListener } from "@/utils/useEventListener";

interface Props {

}

const ArticleSearchBar: React.FC<Props> = () => {

  const [show, setShow] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!isServer()) {
    useEventListener(window, "click", (ev) => {
      if (containerRef.current && !containerRef.current.contains(ev.target as Node)) {
        setShow(false);
      }

    });
  }

  const close = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <Container ref={containerRef}>
      <SearchBar onFocus={() => setShow(true)} />
      <TagDropdown onTagClicked={close} show={show} />
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

export default ArticleSearchBar;
