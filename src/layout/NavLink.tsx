"use client";

import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { AnchorHTMLAttributes, createElement, PropsWithChildren } from "react";
import { Localized } from "src/i18n";
import { NavLink } from "src/layout/Header";

const LinkOrA = (props: PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & Omit<LinkProps, "href"> & { href: string | undefined}
>) => {
  // @ts-ignore
  return createElement(props.href ? Link : "a", props, props.children);
};

const isActive = (href: string, pathname: string) => {
  if (href === "/") { return pathname === "/"; }
  return pathname.startsWith(href);
};

export const NavLinkElement = ({ link }: { link: NavLink }) => {

  const pathname = usePathname();

  return (
    <li>
      <LinkOrA href={link.href} className={classNames({ active: link.href ? isActive(link.href, pathname) : false })}>
        {link.icon}
        {"label" in link ? link.label : <Localized id={link.labelId} />}
      </LinkOrA>
    </li>
  );
};

export const NavDropdown = ({ link }: { link: NavLink }) => {
  const pathname = usePathname();

  if (link.children) {
    return (
      <li>
        <details>
          <summary className={classNames({ active: link.href ? isActive(link.href, pathname) : false })}>
            {link.icon}
            {"label" in link ? link.label : <Localized id={link.labelId} />}
          </summary>
          <ul className="shadow bg-base-200 text-base-content min-w-max">
            {link.children.map((child, i) => (
              <NavLinkElement key={i} link={child} />
            ))}
          </ul>
        </details>
      </li>
    );
  } else {
    return (
      <NavLinkElement link={link} />
    );
  }

};
