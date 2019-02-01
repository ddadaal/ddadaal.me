import * as React from "react";

import { FaQq, FaMailBulk, FaLinkedin, FaGithub, FaSteam, FaZhihu, FaQuora } from "react-icons/fa";
import styled from "styled-components";
import { IconType } from "react-icons";

const contacts = [
  [FaQq, "http://wpa.qq.com/msgrd?v=3&uin=540232834&site=qq&menu=yes", "540232834"],
  [FaMailBulk, "mailto://smallda@outlook.com", "smallda@outlook.com"],
  [FaLinkedin, "https://www.linkedin.com/in/chenjunda/", "陈俊达"],
  [FaGithub, "https://github.com/viccrubs", "viccrubs"],
  [FaSteam, "https://steamcommunity.com/profiles/76561198104889782", "Victor Crubs"],
  [FaZhihu, "https://zhihu.com/people/VicCrubs", "陈俊达"],
  [FaQuora, "https://www.quora.com/profile/Chen-Junda-3", "Chen Junda"],
] as Array<[IconType, string, string]>

const Contact = styled.span`
  svg {
    height: 1.6em;
    width: 1.6em;
    margin: 12px 12px 12px 0;
    color: white;
  }
`;

const Container = styled.div`
  margin: 4px 0;
`;

export default function Contacts() {
  return (
    <Container>
      {contacts.map((contact) => {
        const [Icon, link, title] = contact;
        return (
          <Contact key={link}>
            <a href={link} title={title} target="__blank">
              <Icon />
            </a>
          </Contact>
        );
      })}
    </Container>
  )
}
