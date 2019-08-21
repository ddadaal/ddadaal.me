import { Store } from "simstate";
import { Language, getLanguage } from "@/i18n/definition";
import isServer from "@/utils/isServer";
import { GET_VALUE } from "@/i18n/lang";

interface State {
  language: Language;
}

function getInitialLanguage(): string {
  if (isServer()) {
    return "cn";
  }
  return navigator.language;
}

const splitter = /(\{\})/;

export class I18nStore extends Store<State> {
  constructor() {
    super();
    this.state = { language: getLanguage(getInitialLanguage()) };
  }

  changeLanguage = (language: string): void => {
    this.setState({
      language: getLanguage(language),
    });
  }

  get language(): Language {
    return this.state.language;
  }

  replacePlaceholders = (definition: string, replacements: React.ReactNode[]): React.ReactNode | string => {
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

  getDefinition = (id: string): string => {
    let content = this.state.language.definitions;
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
  }

  translate = (id: string, replacements?: React.ReactNode[]): React.ReactNode | string => {

    const trueId = id[GET_VALUE] as string;

    const def = this.getDefinition(trueId);
    if (!replacements || replacements.length === 0) {
      return def;
    }
    return this.replacePlaceholders(def, replacements);
  }

}
