import classNames from "classnames";
import { useEffect } from "react";
import React from "react";
import Nav from "reactstrap/lib/Nav";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import NavItem from "reactstrap/lib/NavItem";
import { fetcher } from "../fetcher";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { login } from "../ms-login";
import styles from "./private-page.module.scss";

/**
 * Component that handles the top level private page functionality.
 *
 * If the user has an invalid token then they will be redirected
 * to the login page.  If they have an expired token and they are
 * online then they will be redirected to the login page.
 */
export function PrivatePage({
  contentDate,
  children
}: {
  contentDate?: string;
  children: React.ReactNode;
}) {
  const isOnline = useOnlineStatus();
  const name = fetcher.getName();

  useEffect(() => {
    if (fetcher.isInDate() || (fetcher.hasToken() && !isOnline)) {
      return;
    }

    login();
  }, [isOnline]);

  const contentTag = !!contentDate ? (
    <span className="navbar-text">
      Content Copyright &copy; {contentDate} St John Ambulance.
    </span>
  ) : null;

  return (
    <div className={styles.background}>
      <Navbar className={styles.navbar}>
        <NavbarBrand>PocketBook</NavbarBrand>
        <span className="navbar-text">Hi, {name}</span>
      </Navbar>
      <div className={styles.centreContainer}>{children}</div>
      <Navbar className={classNames("fixed-bottom", styles.footer)}>
        <span className="navbar-text">
          Design Copyright &copy; {new Date().getFullYear()} Tony Richards.
        </span>
        {contentTag}
        <Nav>
          <NavItem>
            <Link className="nav-link text-dark" href="/privacy">
              Privacy Policy
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link text-dark" href="/tsandcs">
              Terms of Use
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
    </div>
  );
}
