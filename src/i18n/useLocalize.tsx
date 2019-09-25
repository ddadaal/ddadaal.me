import React from "react";
import { useStore } from "simstate";
import I18nStore from "@/stores/I18nStore";

const useLocalized = (id: string, replacements?: React.ReactNode[]) => {
  const i18nStore = useStore(I18nStore);

  return i18nStore.translate(id, replacements);
}

export default useLocalized;
