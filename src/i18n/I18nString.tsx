import * as React from "react";
import { I18nConsumer } from "./I18nContext";
import { GET_VALUE } from "./lang";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
}

export default class I18nString extends React.Component<Props> {
  shouldComponentUpdate(prevProps: Props) {
    return prevProps.id[GET_VALUE] !== this.props.id[GET_VALUE];
  }

  render() {
    return (
      <I18nConsumer>
        {({ get }) => {
          return get(this.props.id[GET_VALUE], this.props.replacements);
        }}
      </I18nConsumer>
    );
  }
}
