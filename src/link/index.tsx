import classNames from "classnames";
import React from "react";
import { history } from "../history";

/**
 * Component to allow the user to move to a different page.
 *
 * Pulls the shared history object and pushes the new page on to it.
 *
 * User login does not matter.
 *
 * User online status does not matter.
 *
 * This component makes no network requests.
 */
export function Link({
  href,
  className,
  children,
  id,
  disabled
}: {
  href: string;
  className?: string;
  children?: React.ReactNode;
  id?: string;
  disabled?: boolean;
}) {
  function transition(event: {
    currentTarget: { pathname: string; search: string };
    preventDefault(): void;
  }) {
    event.preventDefault();
    history.push({
      pathname: event.currentTarget.pathname,
      search: event.currentTarget.search
    });
  }

  return (
    <a
      href={href}
      className={classNames(className, { disabled })}
      onClick={transition}
      id={id}
    >
      {children}
    </a>
  );
}
