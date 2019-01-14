import * as React from "react";
import { Input } from "reactstrap";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";


interface Props extends WithStoresProps {

}

interface State {
  input: string;
}

class Search extends React.Component<Props, State> {

  state = { input: "" };

  onChange = (e) => {
    this.setState({ input: e.target.value });
  }

  render() {
    const i18nStore = this.props.useStore(I18nStore);

    return (
      <Input
        value={this.state.input}
        onChange={this.onChange}
        placeholder={i18nStore.language.definitions.search.inputPlaceholder}
      />
    );
  }
}

export default withStores(I18nStore)(Search);

