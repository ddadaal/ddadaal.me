interface Tag {
  tag: string;

  [lang: string]: string;
}

type TagMap = Map<string, { [lang: string]: string } | string>;
