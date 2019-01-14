import * as React from "react";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";
import { navigate } from "gatsby";
import { FaSearch } from "react-icons/fa";


interface Props extends WithStoresProps {
  onSearch?(): void;
}

interface State {
  input: string;
}

class SearchBar extends React.Component<Props, State> {

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
    const i18nStore = this.props.useStore(I18nStore);

    return (
      <InputGroup>
        <Input
          value={this.state.input}
          onChange={this.onChange}
          placeholder={i18nStore.language.definitions.search.inputPlaceholder}
          onKeyPress={this.onKeyPress}
        />
        <InputGroupAddon addonType="append">
          <Button onClick={this.onSearch} color="secondary"><FaSearch /></Button>
        </InputGroupAddon>
      </InputGroup>
    );
  }
}

export default withStores(I18nStore)(SearchBar);

