import React from "react";

import { FaQq, FaMailBulk, FaLinkedin, FaGithub, FaSteam, FaZhihu, FaQuora, FaStackOverflow } from "react-icons/fa";
import styled from "styled-components";

import DoubanIcon from "~/assets/icons/douban.svg";

interface Props {
  color: string;
  size: number;
}

const contacts = [
  [FaQq, "http://wpa.qq.com/msgrd?v=3&uin=540232834&site=qq&menu=yes", "QQ: 540232834"],
  [FaMailBulk, "mailto://smallda@outlook.com", "E-mail: smallda@outlook.com"],
  [FaLinkedin, "https://www.linkedin.com/in/chenjunda/", "LinkedIn: 陈俊达"],
  [FaGithub, "https://github.com/viccrubs", "GitHub: viccrubs"],
  [FaSteam, "https://steamcommunity.com/profiles/76561198104889782", "Steam: Victor Crubs"],
  [FaZhihu, "https://zhihu.com/people/VicCrubs", "知乎：陈俊达"],
  [FaQuora, "https://www.quora.com/profile/Chen-Junda-3", "Quora: Chen Junda"],
  [DoubanIcon, "https://www.douban.com/people/183064260/", "豆瓣: VicCrubs"],
  [FaStackOverflow, "https://stackoverflow.com/users/2725415/chen-junda", "Stack Overflow: Chen Junda"],
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
}

export default Contacts;
