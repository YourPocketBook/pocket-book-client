import React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { Link } from "../link";
import { PublicPage } from "../public-page";
import "../styles/button.scss";
import "../styles/headers.css";

export function ForgotPasswordDone() {
  return (
    <PublicPage>
      <Row>
        <Col>
          <h1 className="text-center">Reset Your Password</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Thanks. As long as that email is correct, you will now need to check
            your inbox, where you will shortly receive a confirmation email
            which will explain what to do next.
          </p>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 4, offset: 4 }}>
          <Link className="btn btn-block btn-dark-green" href="/" id="home-button">
            Home
          </Link>
        </Col>
      </Row>
    </PublicPage>
  );
}
