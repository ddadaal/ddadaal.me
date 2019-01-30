import Store from "./Store";
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

export class I18nStore extends Store<II18nStore> {
  state = { language: getLanguage(getInitialLanguage()) };

  changeLanguage = (language: string) => {
    this.setState({
      language: getLanguage(language),
    });

  }

  getLanguage = (lang: string) => {
    return allLanguages.find((x) => x.languages.includes(lang));
  }

  get language() {
    return this.state.language;
  }

  replacePlaceholders = (definition: string, replacements: React.ReactNode[]): React.ReactNode | string => {
    const splitter = /(\{\})/;
    const array = definition.split(splitter) as React.ReactNode[];
    let ri = 0;
    for (let i = 1; i < array.length; i += 2) {
      array[i] = replacements[ri++];
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

  getPathWithoutLang(path: string) {
    let i = 0, slashCount = 0;
    while (slashCount < 2 && i < path.length) {
      if (path[i] === '/') {
        slashCount++;
      }
      i++;
    }
    return path.substring(i - 1);


  }

  get allLanguages() {
    return allLanguages;
  }



}
