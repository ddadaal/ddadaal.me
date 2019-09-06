import React from "react";

import I18nStore from "@/stores/I18nStore";
import { useStore } from "simstate";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
  children(result: string): React.ReactElement;
}

const Localize: React.FC<Props> = ({ id, replacements, children }) => {
  const store = useStore(I18nStore);

  const result = store.translate(id, replacements) as string;

  return children(result);
}

export default Localize;
