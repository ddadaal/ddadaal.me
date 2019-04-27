import React, { useState } from "react";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { navigate } from "gatsby";
import { FaSearch } from "react-icons/fa";
import Localize from "@/i18n/Localize";
import lang from "@/i18n/lang";
import { useStore } from "simstate";
import { LocationStore } from "@/stores/LocationStore";

interface Props {
  onSearch?(): void;
}

export default function SearchBar(props: Props) {
  const locationStore = useStore(LocationStore);

  console.log(locationStore.pathname);

  const [ input, setInput ] = useState("");

  const onSearch = () => {
    navigate(`/articles/search?query=${encodeURIComponent(input)}`);
    if (props.onSearch) {
      props.onSearch();
    }
  };

  return (
    <InputGroup>
      <Localize id={lang.search.inputPlaceholder}>
        {(result) => (
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={result}
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
