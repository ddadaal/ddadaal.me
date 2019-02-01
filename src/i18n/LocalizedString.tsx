import * as React from "react";
import { GET_VALUE } from "./lang";
import { connect } from "net";
import { I18nStore } from "@/stores/I18nStore";
import withStores, { WithStoresProps } from "@/stores/withStores";

interface Props extends WithStoresProps {
  id: string;
  replacements?: React.ReactNode[];
}

export default withStores(I18nStore)(function LocalizedString({ useStore, id, replacements }: Props) {

  const i18nStore = useStore(I18nStore);

  return i18nStore.translate(id, replacements) as any;

});
