"use client";

import Image from "next/image";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";
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
    <Item
      alt={imageProps.alt ?? ""}
      original={src}
      width={imageSize.width}
      height={imageSize.height}
    >
      {({ ref, open }) => (
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
  );
};
