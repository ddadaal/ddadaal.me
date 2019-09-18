import { getLanguage } from "@/i18n/definition";
import isServer from "@/utils/isServer";
import { GET_VALUE } from "@/i18n/lang";
import { useState, useCallback } from "react";

function getInitialLanguage(): string {
  if (isServer()) {
    return "cn";
  }
  return navigator.language;
}

const splitter = /(\{\})/;

function replacePlaceholders(definition: string, replacements: React.ReactNode[]): React.ReactNode | string {
  const array = definition.split(splitter) as React.ReactNode[];
  let ri = 0;

  let containsNonPrimitive = false;

  for (let i = 1; i < array.length; i += 2) {
    if (typeof replacements[ri] === "object") {
      containsNonPrimitive = true;
    }
    array[i] = replacements[ri++];
  }

  if (!containsNonPrimitive) {
    return array.join("");
  }

  return array;
}

export default function I18nStore() {
  const [language, setLanguage] = useState(getLanguage(getInitialLanguage()));

  const changeLanguage = useCallback((langString: string) => setLanguage(getLanguage(langString)), []);

  const getDefinition = useCallback((id: string): string => {
    let content = language.definitions;
    for (const key of id.split(".")) {
      if (typeof content === "undefined") {
        throw new RangeError(`unidentified id ${id}`);
      }
      content = content[key];
    }
    if (typeof content !== "string") {
      throw new RangeError(`id ${id} does not refer to a string. actual value: ${content}`);
    }
    return content;
  }, [language]);

  const translate = useCallback((id: string, replacements?: React.ReactNode[]): React.ReactNode | string => {

    const trueId = id[GET_VALUE] as string;

    const def = getDefinition(trueId);
    if (!replacements || replacements.length === 0) {
      return def;
    }
    return replacePlaceholders(def, replacements);
  }, [getDefinition]);

  return { language, changeLanguage, translate };

}

