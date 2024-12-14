import { getLanguage } from "src/i18n";

import tags from "../../contents/tags.json";

export { tags };

export function getLocaleTag(lang: string, tag: string) {
  const tagItem = tags.find((x) => x.tag === tag);

  return tagItem?.[getLanguage(lang).simplified as keyof typeof tagItem] ?? tag;
}
