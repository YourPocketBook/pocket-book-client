import React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { Link } from "../link";
import { PublicPage } from "../public-page";
import "../styles/button.scss";
import "../styles/headers.css";

export function LoginError() {
  return (
    <PublicPage>
      <Row>
        <Col>
          <h1 className="text-center">Login Error</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Sorry, that didn't work. Make sure you are logging in with your SJA
            account, and that you grant access. Don't worry, we don't store your
            personal data, it's just to make sure that only SJA people can make
            use of this site.
          </p>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 4, offset: 4 }}>
          <Link
            className="btn btn-block btn-dark-green"
            href="/"
            id="home-button"
          >
            Home
          </Link>
        </Col>
      </Row>
    </PublicPage>
  );
}
