interface Tag {
  tag: string;

  [lang: string]: string;
}

interface TagInfo {
  count: number;
  variations: { [lang: string]: string } | string;
}

type TagMap = Map<string, TagInfo>;
