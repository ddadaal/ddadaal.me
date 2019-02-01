import * as React from "react";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import { navigate } from "gatsby";
import { FaSearch } from "react-icons/fa";
import Localize from "@/i18n/Localize";
import lang from "@/i18n/lang";


interface Props {
  onSearch?(): void;
}

interface State {
  input: string;
}

export default class SearchBar extends React.Component<Props, State> {

  state = { input: "" };

  onKeyPress = (ev) => {
    if (ev.key === "Enter") {
      this.onSearch();
    }
  };

  onSearch = () => {
    navigate(`/search?query=${encodeURIComponent(this.state.input)}`);
    this.props.onSearch && this.props.onSearch();
  }

  onChange = (e) => {
    this.setState({ input: e.target.value });
  }

  render() {

    return (
      <InputGroup>
        <Localize id={lang.search.inputPlaceholder}>
          {(result) => (
            <Input
              value={this.state.input}
              onChange={this.onChange}
              placeholder={result}
              onKeyPress={this.onKeyPress}
            />
          )}
        </Localize>
        <InputGroupAddon addonType="append">
          <Button onClick={this.onSearch} color="secondary"><FaSearch /></Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}


