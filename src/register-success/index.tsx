import React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { Link } from "../link";
import { PublicPage } from "../public-page";
import "../styles/button.scss";
import "../styles/headers.css";

export function RegisterSuccess() {
  return (
    <PublicPage>
      <Row>
        <Col>
          <h1 className="text-center">Register Success</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Thanks, you have registered successfully. You now need to check your
            inbox, where you will shortly receive a confirmation email which
            will explain what to do next.
          </p>
        </Col>
      </Row>
      <Row>
        <Col sm={{ size: 4, offset: 4 }}>
          <Link className="btn btn-dark-green" href="/" id="home-button">
            Home
          </Link>
        </Col>
      </Row>
    </PublicPage>
  );
}
