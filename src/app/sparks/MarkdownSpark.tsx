import { JSX } from "react";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { rehypeReactOptions } from "src/components/article/ArticleContent";
import { unified } from "unified";

export async function MarkdownSpark({ content }: { content: string }) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeReact, { ...rehypeReactOptions })
    .process(content);

  return file.result as JSX.Element;
}
