import { Store } from "simstate";
import { Language, getLanguage, allLanguages } from "@/i18n/definition";
import { isServer } from "@/utils/isServer";
import { GET_VALUE } from "@/i18n/lang";

interface II18nStore {
  language: Language;
}

function getInitialLanguage() {
  if (isServer()) {
    return "cn";
  }
  return navigator.language;
}

const splitter = /(\{\})/;

export class I18nStore extends Store<II18nStore> {
  constructor() {
    super();
    this.state = { language: getLanguage(getInitialLanguage()) };
  }

  changeLanguage = (language: string) => {
    this.setState({
      language: getLanguage(language),
    });

  }

  getLanguage = (lang: string) => {
    return allLanguages.find((x) => x.name === lang || x.languages.includes(lang));
  }

  get language() {
    return this.state.language;
  }

  replacePlaceholders = (definition: string, replacements: React.ReactNode[]): React.ReactNode | string => {
    const array = definition.split(splitter) as React.ReactNode[];
    let ri = 0;

    let containsNonString = false;

    for (let i = 1; i < array.length; i += 2) {
      if (typeof replacements[ri] !== "string") {
        containsNonString = true;
      }
      array[i] = replacements[ri++];
    }

    if (!containsNonString) {
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

  get allLanguages() {
    return allLanguages;
  }

}
