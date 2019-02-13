import { Link } from "gatsby";
import React from "react";

export default function NavLink(props: { to: string, children: React.ReactNode, onClick?(): void }) {
  return (
    <Link to={props.to} onClick={props.onClick} className="nav-link">
      {props.children}
    </Link>
  );
}
