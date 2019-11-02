import { baselineLanguage, Definitions } from "@/i18n/definition";

const lang = {};

function makeLangObj(obj: {}, baselineLangSection: {}, baseKey: string) {
  for (const key in baselineLangSection) {
    const newKey = baseKey + key;
    switch (typeof baselineLangSection[key]) {
      case "string":
        obj[key] = newKey;
        break;
      case "object":
        obj[key] = {};
        makeLangObj(obj[key], baselineLangSection[key], newKey + ".");
        break;
      default:
        throw `Unexpected value in ${newKey}. string/object only`;
    }
  }
}

makeLangObj(lang, baselineLanguage.definitions, "");

export default lang as Definitions;
