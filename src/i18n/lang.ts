import { Definitions } from "./definition";

export const GET_VALUE = "__get";

export class Lang {
  constructor(public paths: PropertyKey[]) { }
}

function factory(langObj: Lang): Definitions {
  const obj = new Proxy(langObj, {
    get: (t, k) => {
      if (k === GET_VALUE) {
        return langObj.paths.join(".");
      }
      return factory(new Lang([...t.paths, k]));
    },
  }) as unknown;
  return obj as Definitions;
}

const lang = factory(new Lang([]));

export default lang as Definitions;
