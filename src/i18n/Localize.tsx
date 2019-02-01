import * as React from "react";
import withStores, { WithStoresProps } from "@/stores/withStores";
import { I18nStore } from "@/stores/I18nStore";

interface Props extends WithStoresProps {
  id: string;
  replacements?: React.ReactNode[];
  children(result: string): React.ReactElement<any, any>;
}

export default withStores(I18nStore)(function Localize({ id, replacements, children, useStore }: Props) {
  const store = useStore(I18nStore);

  const result = store.translate(id, replacements) as string;

  return children(result);
});
