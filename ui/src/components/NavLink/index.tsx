/* eslint-disable react/prop-types */
import React, { Children } from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  children,
  exact = false,
  activeClassName = "text-high-emphesis",
  ...props
}) => {
  const asPath = useLocation().pathname;
  const child = Children.only(children);
  const childClassName = child.props.className || "";

  const isActive = exact
    ? (props.as || props.href.pathname || props.href) === asPath
    : asPath.startsWith(props.as || props.href.pathname || props.href);

  const className = isActive
    ? `${childClassName} ${activeClassName}`.trim()
    : childClassName;

  return (
    <Link to={props.href} {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

export default NavLink;
