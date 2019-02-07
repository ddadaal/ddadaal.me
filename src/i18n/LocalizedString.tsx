import React from "react";
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
