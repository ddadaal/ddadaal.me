import "./styles.css";
import "photoswipe/dist/photoswipe.css";

import rehypeExtractToc from "@stefanprobst/rehype-extract-toc";
import classNames from "classnames";
import imageSize from "image-size";
import { dirname, join } from "path";
import { ComponentType, createElement } from "react";
import * as prod from "react/jsx-runtime";
import { FaLink } from "react-icons/fa";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeReact, { Options as RehypeReactOptions } from "rehype-react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { ArticleSummarization } from "src/components/article/ArticleSummarization";
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

export const ArticleImageServer = async ({ article, props }: Props & {
  props: ArticleImageProps["imageProps"]
}) => {

  const src = props.src!;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return <img {...props} />;
  }

  const imagePath = join(dirname(article.filePath), src);

  const size = await imageSizeAsync(imagePath);

  const fullUrl = join("/articles/asset", imagePath);

  return (
    <figure>
      <ArticleImage
        src={fullUrl}
        imageSize={{
          height: size?.height ?? 100,
          width: size?.width ?? 100,
        }}
        imageProps={props}
      />
      {
        props.alt ? (
          <figcaption className="text-center">
            {props.alt}
          </figcaption>
        ) : null
      }
    </figure>
  );
};

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

interface HeadingWithLinkProps {
  element: "h1" | "h2" | "h3";
  props: JSX.IntrinsicElements["h1"] ;
  anchorLinkClassName?: string;
}

export const HeadingWithLink = (props: HeadingWithLinkProps) => {

  return createElement(props.element, props.props, [
    <a href={"#" + props.props.id} className={classNames("mr-1", props.anchorLinkClassName)} key={props.props.id}>
      <FaLink className="inline-block opacity-20 hover:opacity-60" size={16} />
    </a>,
    props.props.children,
  ]);
};

export const ArticleContent = async ({ article }: Props) => {

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
        img: ((props) => <ArticleImageServer article={article} props={props} />) satisfies
          ComponentType<JSX.IntrinsicElements["img"]>,
        h1: ((props) => <HeadingWithLink element="h1" props={props} />) satisfies
          ComponentType<JSX.IntrinsicElements["h1"]>,
        h2: ((props) => <HeadingWithLink element="h2" props={props} />) satisfies
          ComponentType<JSX.IntrinsicElements["h2"]>,
        h3: ((props) => <HeadingWithLink element="h3" props={props} />) satisfies
          ComponentType<JSX.IntrinsicElements["h3"]>,
      },
    } as RehypeReactOptions)
    .process(article.content);

  const showToc = !article.no_toc && file.data.toc && file.data.toc.length > 0;

  return (
    <div className="flex flex-row space-x-4">
      <div className={classNames("prose", "max-w-full", { "lg:w-[75%]": showToc })}>
        {
          article.summaries ? (
            <ArticleSummarization summaries={article.summaries} />
          ) : undefined
        }
        <Gallery withCaption id={article.id}>
          {file.result}
        </Gallery>
      </div>
      {
        showToc ? (
          <div className="hidden lg:block lg:w-[25%]">
            <ArticleToc toc={file.data.toc!} hasSummary={!!article.summaries} />
          </div>
        ) : undefined
      }
    </div>
  );
};
