export interface Tag {
  tag: string;

  [lang: string]: string;
}

interface TagInfo {
  count: number;
  variations: { [lang: string]: string } | string;
}

export type TagMap = Map<string, TagInfo>;
