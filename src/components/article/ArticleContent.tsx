import "./styles.css";
import "photoswipe/dist/photoswipe.css";

import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import classNames from "classnames";
import imageSize from "image-size";
import { dirname, join } from "path";
import React, { ComponentType, JSX } from "react";
import * as prod from "react/jsx-runtime";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeReact, { Options as RehypeReactOptions } from "rehype-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { ArticleSummarization } from "src/components/article/ArticleSummarization";
import { HeadingWithLink } from "src/components/article/Components";
import { Gallery } from "src/components/article/Gallery";
import { Article } from "src/data/articles";
import { unified } from "unified";
import { promisify } from "util";

import { ArticleImage, ArticleImageProps } from "./ArticleImage";
import { ArticleToc } from "./ArticleToc";

interface Props {
  article: Article;
}

const imageSizeAsync = promisify(imageSize);

export const ArticleImageServer = async ({ article, imageProps }: Props & {
  imageProps: ArticleImageProps["imageProps"];
}) => {
  const src = imageProps.src;

  if (!src) {
    return null;
  }

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return <img {...imageProps} />;
  }

  const imagePath = join(dirname(article.filePath), src);

  const size = await imageSizeAsync(imagePath);

  const fullUrl = join("/articles/asset", imagePath);

  return (
    <ArticleImage
      src={fullUrl}
      imageSize={{
        height: size?.height ?? 100,
        width: size?.width ?? 100,
      }}
      imageProps={imageProps}
    />
  );
};

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export const parseArticleContent = async (article: Article) => {
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeExtractToc)
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
    })
    .use(rehypeRaw)
    .use(rehypeReact, {
      ...production,
      components: {
        img: ((props) => <ArticleImageServer article={article} imageProps={props} />) satisfies
          ComponentType<React.JSX.IntrinsicElements["img"]>,
        h1: ((props) => <HeadingWithLink element="h1" props={props} />) satisfies
          ComponentType<React.JSX.IntrinsicElements["h1"]>,
        h2: ((props) => <HeadingWithLink element="h2" props={props} />) satisfies
          ComponentType<React.JSX.IntrinsicElements["h2"]>,
        h3: ((props) => <HeadingWithLink element="h3" props={props} />) satisfies
          ComponentType<React.JSX.IntrinsicElements["h3"]>,
      },
    } as RehypeReactOptions)
    .process(article.content);

  return file as unknown;
};

async function parseSummarization(content: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeReact, {
      ...production,
    })
    .process(content);

  return file.result as JSX.Element;
}

export const ArticleContent = async ({ article }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file: any = await parseArticleContent(article);

  const summaries = article.summary
    ? await Promise.all(article.summary.summaries.map(async (x) => {
      const children = await parseSummarization(x.summaries.join("\n\n"));
      return {
        metadata: x.metadata,
        children,
      };
    }))
    : undefined;

  const showToc = !article.no_toc && file.data.toc && file.data.toc.length > 0;

  return (
    <div className="flex flex-row space-x-4">
      <div className={classNames("prose", "max-w-full", { "lg:w-[75%]": showToc })}>
        {
          summaries
            ? (
                <ArticleSummarization summaries={summaries} />
              )
            : undefined
        }
        <Gallery withCaption id={article.id}>
          {file.result}
        </Gallery>
      </div>
      {
        showToc && file.data.toc
          ? (
              <div className="hidden lg:block lg:w-[25%]">
                <ArticleToc toc={file.data.toc} hasSummary={!!article.summary} />
              </div>
            )
          : undefined
      }
    </div>
  );
};
