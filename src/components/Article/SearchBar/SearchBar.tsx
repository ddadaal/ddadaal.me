import React, { useState } from "react";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { navigate } from "gatsby";
import { FaSearch } from "react-icons/fa";
import Localize from "@/i18n/Localize";
import lang from "@/i18n/lang";
import { useStore } from "simstate";
import { MetadataStore } from "@/stores/MetadataStore";

interface Props {
  onSearch?(): void;
  className?: string;
  onFocus?(): void;
  onBlur?(): void;
}

const SearchBar: React.FC<Props> = (props: Props) => {

  const metadataStore = useStore(MetadataStore);
  const [input, setInput] = useState("");

  const onSearch = (): void => {
    navigate(`/articles/search?query=${encodeURIComponent(input)}`);
    if (props.onSearch) {
      props.onSearch();
    }
  };

  return (
    <InputGroup className={props.className}>
      <Localize id={lang.search.inputPlaceholder} replacements={[
        metadataStore.articleCount,
      ]}>
        {(result) => (
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={result}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />
        )}
      </Localize>
      <InputGroupAddon addonType="append">
        <Button onClick={onSearch} color="secondary"><FaSearch /></Button>
      </InputGroupAddon>
    </InputGroup>
  );

}

export default SearchBar;
