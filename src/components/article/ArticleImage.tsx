"use client";


import Image from "next/image";
import { join } from "path";
import { DetailedHTMLProps, ImgHTMLAttributes } from "react";

export interface ArticleImageProps {
  filePath: string;
  imageProps: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
  imageSize: { height: number; width: number };
}

const loader = ({ src, width }: { src: string; width: number }) => {
  return `${src}?width=${width}`;
};

export const ArticleImage = ({ filePath, imageSize, imageProps }: ArticleImageProps) => {

  return (
    <Image
      loader={loader}
      alt={imageProps.alt ?? ""}
      src={join("/articles/asset", filePath)}
      width={imageSize.width}
      height={imageSize.height}
    />
  );

};

