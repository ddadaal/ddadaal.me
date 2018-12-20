import * as React from "react";
import { I18nConsumer } from "./I18nContext";
import { GET_VALUE } from "./lang";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
}

export default function I18nString(props: Props) {
  return (
    <I18nConsumer>
      { ({ get }) => {
        return get(props.id[GET_VALUE], props.replacements);
      }}
    </I18nConsumer>
  );
}
