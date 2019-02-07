import * as React from "react";

import { I18nStore } from "@/stores/I18nStore";
import { useStore } from "@/stores/stater";

interface Props {
  id: string;
  replacements?: React.ReactNode[];
  children(result: string): React.ReactElement<any, any>;
}

export default function Localize({ id, replacements, children }: Props) {
  const store = useStore(I18nStore);

  const result = store.translate(id, replacements) as string;

  return children(result);
};
