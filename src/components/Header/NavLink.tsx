import { Link } from "gatsby";
import React from "react";

interface Props {
  to: string;
  children: React.ReactNode;
  onClick?(): void;
}


const NavLink: React.FC<Props> = ({ to, children, onClick }) => {
  return (
    <Link to={to} onClick={onClick} className="nav-link">
      {children}
    </Link>
  );
};

export default NavLink;
