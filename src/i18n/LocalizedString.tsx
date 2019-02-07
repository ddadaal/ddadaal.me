import * as React from "react";
import { GET_VALUE } from "./lang";
import { connect } from "net";
import { I18nStore } from "@/stores/I18nStore";

import { useStore } from "@/stores/stater";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
}

export default function LocalizedString({ id, replacements }: Props) {

  const i18nStore = useStore(I18nStore);

  return i18nStore.translate(id, replacements) as any;

};
