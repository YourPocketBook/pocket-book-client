import classNames from "classnames";
import React from "react";
import { useEffect } from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Nav from "reactstrap/lib/Nav";
import Navbar from "reactstrap/lib/Navbar";
import NavbarBrand from "reactstrap/lib/NavbarBrand";
import NavItem from "reactstrap/lib/NavItem";
import Row from "reactstrap/lib/Row";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { Link } from "../link";
import styles from "./public-page.module.scss";

/**
 * Component that handles the top level public page functionality.
 *
 * If the user has a valid token then they will be redirected to the home page.
 */
export function PublicPage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (fetcher.isInDate()) {
      history.push("/home");
    } else {
      fetcher.clearToken();
    }
  }, []);

  return (
    <div className={styles.background}>
      <Navbar className={styles.navbar}>
        <NavbarBrand>PocketBook</NavbarBrand>
      </Navbar>
      <Container className={styles.centreContainer}>
        <Row>
          <Col lg={{ size: 6, offset: 3 }}>
            <div className={styles.centreBox}>{children}</div>
          </Col>
        </Row>
      </Container>
      <Navbar className={classNames("fixed-bottom", styles.footer)}>
        <span className="navbar-text">
          Design Copyright &copy; {new Date().getFullYear()} Tony Richards.
        </span>
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
