import * as React from "react";
import { getDefinitions, Definitions, Language, getLanguage, allLanguages } from "./definition";

const I18nContext = React.createContext({
  language: {} as any as Language,
  changeLanguage: (language: string) => { },
  get: (id: string, replacements?: React.ReactNode[]) => id as string | React.ReactNode,
  allLanguages: [] as Language[],
});

interface ProviderState {
  language: Language;
  changeLanguage(lang: string): void;
  get(id: string): string | React.ReactNode;
  allLanguages: Language[];
}

interface ProviderProps {
}

const SETTING_KEY = "lang";

export class I18nProvider extends React.Component<ProviderProps, ProviderState> {
  changeLanguage = (language: string) => {
    this.setState({
      language: getLanguage(language),
    });

    localStorage.setItem(SETTING_KEY, language);
  }

  get = (id: string, replacements?: React.ReactNode[]): React.ReactNode | string => {
    const def = this.getDefinition(id);
    if (!replacements || replacements.length === 0) {
      return def;
    }
    return this.replacePlaceholders(def, replacements);
  }

  replacePlaceholders(definition: string, replacements: React.ReactNode[]): React.ReactNode | string {
    const splitter = /(\{\})/;
    const array = definition.split(splitter) as React.ReactNode[];
    let ri = 0;
    for (let i = 1; i < array.length; i += 2) {
      array[i] = replacements[ri++];
    }
    return array;
  }

  getDefinition(id: string): string {
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

  state = {
    language: getLanguage(localStorage.getItem(SETTING_KEY) || ( navigator ? navigator.language : "cn")),
    changeLanguage: this.changeLanguage,
    get: this.get,
    allLanguages,
  };

  componentWillUnmount() {
    console.log("provider unmount");
  }

  render() {
    return (
      <I18nContext.Provider value={this.state}>
        {this.props.children}
      </I18nContext.Provider>
    );
  }
}

export const I18nConsumer = I18nContext.Consumer;
