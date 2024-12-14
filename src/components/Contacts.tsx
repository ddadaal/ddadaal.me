import classNames from "classnames";
import Image from "next/image";
import React from "react";
import { IconType } from "react-icons";
import {
  FaGithub, FaLinkedin,
  FaMailBulk, FaQq, FaSteam, FaZhihu,
} from "react-icons/fa";
import { SiDouban } from "react-icons/si";

interface Props {
  size: number;
  className?: string;
}

type IconSrc = IconType | React.ComponentProps<typeof Image>["src"];

const contacts = [
  [FaQq, "http://wpa.qq.com/msgrd?v=3&uin=540232834&site=qq&menu=yes", "QQ: 540232834"],
  [FaMailBulk, "mailto://ddadaal.me@outlook.com", "E-mail: ddadaal@outlook.com"],
  [FaLinkedin, "https://www.linkedin.com/in/chenjunda/", "LinkedIn: 陈俊达"],
  [FaGithub, "https://github.com/ddadaal", "GitHub: ddadaal"],
  [FaSteam, "https://steamcommunity.com/profiles/76561198104889782",
    "Steam: Victor Crubs"],
  [FaZhihu, "https://zhihu.com/people/VicCrubs", "知乎：陈俊达"],
  [SiDouban, "https://www.douban.com/people/183064260/", "豆瓣: ddadaal"],
] as const;

const Icon = ({ Src, link, text, size }: { Src: IconSrc; link: string; text: string; size: number }) => {
  const sizeInPx = size * 14;

  return (
    <a
      href={link}
      title={text}
      target="_blank"
      className="block transition hover:scale-125"
      rel="noreferrer"
    >
      {typeof Src === "object"
        ? <Image src={Src} alt={text} height={sizeInPx} width={sizeInPx} />
        : <Src size={sizeInPx} />}
    </a>
  );
};

export const Contacts: React.FC<Props> = ({ size, className }) => {
  return (
    <div className={classNames("flex py-2 gap-2", className)}>
      {contacts.map((contact) => {
        const [src, link, title] = contact;
        return (
          <span key={link}>
            <Icon Src={src} link={link} text={title} size={size} />
          </span>
        );
      })}
    </div>
  );
};
