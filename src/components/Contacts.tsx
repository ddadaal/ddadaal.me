import React from "react";
import {
  FaGithub, FaLinkedin,
  FaMailBulk,   FaQq, FaSteam, FaZhihu,
} from "react-icons/fa";
import styled from "styled-components";

import DoubanIcon from "~/assets/icons/douban.svg";
import TapeIcon from "~/assets/icons/tape.svg";

interface Props {
  color: string;
  size: number;
}

const contacts = [
  [FaQq, "http://wpa.qq.com/msgrd?v=3&uin=540232834&site=qq&menu=yes", "QQ: 540232834"],
  [FaMailBulk, "mailto://ddadaal.me@outlook.com", "E-mail: ddadaal@outlook.com"],
  [FaLinkedin, "https://www.linkedin.com/in/chenjunda/", "LinkedIn: 陈俊达"],
  [FaGithub, "https://github.com/ddadaal", "GitHub: ddadaal"],
  [FaSteam, "https://steamcommunity.com/profiles/76561198104889782",
    "Steam: Victor Crubs"],
  [FaZhihu, "https://zhihu.com/people/VicCrubs", "知乎：陈俊达"],
  [DoubanIcon, "https://www.douban.com/people/183064260/", "豆瓣: ddadaal"],
  [TapeIcon, "https://www.tapechat.net/u/2JJ1Y7/4YSQBV0A", "Tape小纸条: ddadaal98"],
] as Array<[React.ComponentType, string, string]>;

const Contact = styled.span<{ color: string; size: number }>`
  svg {
    transition: transform 0.2s linear;

    height: ${(props) => props.size}em;
    width: ${(props) => props.size}em;
    margin: 12px 12px 12px 0;
    color: ${(props) => props.color};
    fill: ${(props) => props.color};

    &:hover {
      transform: scale(1.4);
    }


  }

`;

const Container = styled.div`
  margin: 4px 0;
`;

const Contacts: React.FC<Props> = (props) => {

  return (
    <Container>
      {contacts.map((contact) => {
        const [Icon, link, title] = contact;
        return (
          <Contact key={link} color={props.color} size={props.size}>
            <a href={link} title={title} target="__blank">
              <Icon />
            </a>
          </Contact>
        );
      })}
    </Container>
  );
};

export default Contacts;
