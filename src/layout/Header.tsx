"use client";

import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBookOpen, FaEllipsisH, FaFile, FaGlobe, FaHome, FaInfo, FaMale, FaSlideshare } from "react-icons/fa";
import { languages, Localized, TextId } from "src/i18n";
import logo from "src/icons/logo.svg";
import { LanguageSwitcher } from "src/layout/LanguageSwitcher";
import { NavDropdown, NavLinkElement } from "src/layout/NavLink";
import { ThemeChanger } from "src/layout/ThemeChanger";

export type NavLink = {
  icon: React.ReactNode;
  href?: string;
  children?: NavLink[];
} & ({ labelId: TextId } | { label: string });

interface Props {
  resumeLangs: string[];
}

export const Header = ({ resumeLangs }: Props) => {

  const pathname = usePathname();

  const links: NavLink[] = [
    { icon: <FaHome />, labelId: "headers.home", href: "/" },
    { icon: <FaBookOpen />, labelId: "headers.articles", href: "/articles" },
    { icon: <FaFile />, labelId: "headers.resume", href: "/resume",
      children: resumeLangs.map((x) => {
        const language = Object.values(languages).find((y) => y.simplified === x)!;
        return {
          icon: <language.icon />,
          label: language.name,
          href: `/resume/${x}`,
        }; }),
    },
    { icon: <FaSlideshare />, labelId: "headers.slides", href: "/slides" },
    { icon: <FaInfo />, labelId: "headers.about.title", href: "/about", children: [
      { icon: <FaBookOpen />, labelId: "headers.about.odyssey", href: "/about/odyssey" },
      { icon: <FaGlobe />, labelId: "headers.about.project", href: "/about/project" },
      { icon: <FaMale />, labelId: "headers.about.me", href: "/about/me" },
    ]},
  ];

  const homePage = pathname === "/";

  const bgColor = homePage ? "bg-primary text-primary-content" : "bg-base-200 text-base-content";
  const btnClassName = homePage ? "btn-primary" : undefined;

  return (
    <div className={classNames(
      "items-center sticky top-0 z-50 w-full",
      "h-14",
      "transition",
      bgColor,
    )}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <Link className="flex items-center justify-center space-x-1" href="/">
          <Image src={logo} alt="logo" width={42} height={42} />
          <h1 className="text-sm font-bold">ddadaal.me</h1>
        </Link>
        <div className="flex items-center gap-1">
          <div className="hidden lg:flex">
            <ul className="menu menu-horizontal">
              {links.map((link, i) => <NavDropdown key={i} link={link} />)}
            </ul>
          </div>
          <ThemeChanger btnClassName={btnClassName} />
          <LanguageSwitcher btnClassName={btnClassName} />
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost">
              <FaEllipsisH />
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content
              mt-3 p-2 shadow rounded-box bg-base-200 text-base-content
              "
            >
              {
                links.map((link, i) => {
                  if (link.children) {
                    return (
                      <li key={i}>
                        <a>
                          {link.icon}
                          {"label" in link ? link.label : <Localized id={link.labelId} />}
                        </a>
                        <ul>
                          {link.children.map((x, i) => <NavLinkElement key={i} link={x} />)}
                        </ul>
                      </li>
                    );
                  } else {
                    return (
                      <NavLinkElement key={i} link={link} />
                    );
                  }
                })
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
