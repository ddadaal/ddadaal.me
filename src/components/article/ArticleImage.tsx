"use client";

import "photoswipe/dist/photoswipe.css";

import Image from "next/image";
import { DetailedHTMLProps, ImgHTMLAttributes, Ref } from "react";
import { Item } from "react-photoswipe-gallery";

export interface ArticleImageProps {
  src: string;
  imageProps: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
  imageSize: { height: number; width: number };
}

const loader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?width=${width.toString()}`;
};

export const ArticleImage = ({ src, imageSize, imageProps }: ArticleImageProps) => {
  return (
    // Markdown images can appear inside paragraphs, links, or table cells.
    // Keep the markup phrasing content so the HTML parser never closes a <p>
    // around a block-level <figure> before React hydrates it.
    <span className="article-image" role="figure" aria-label={imageProps.alt || undefined}>
      <Item
        alt={imageProps.alt ?? ""}
        original={src}
        width={imageSize.width}
        height={imageSize.height}
      >
        {({ ref, open }: { ref: Ref<HTMLImageElement>; open: () => void }) => (
          <Image
            ref={ref}
            loader={loader}
            onClick={open}
            alt={imageProps.alt ?? ""}
            src={src}
            width={imageSize.width}
            height={imageSize.height}
            className="cursor-zoom-in mx-auto"
          />
        )}
      </Item>
      {imageProps.alt ? <span className="article-image-caption">{imageProps.alt}</span> : null}
    </span>
  );
};
