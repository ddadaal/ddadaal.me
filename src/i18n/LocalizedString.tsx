import React from "react";
import I18nStore from "@/stores/I18nStore";

import { useStore } from "simstate";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
}

const LocalizedString: React.FC<Props> = ({ id, replacements }) => {

  const i18nStore = useStore(I18nStore);

  return i18nStore.translate(id, replacements) as unknown as React.ReactElement;

};

export default LocalizedString;
