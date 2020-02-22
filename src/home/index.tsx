import React from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { login } from "../ms-login";
import { OfflineNotice } from "../offlineNotice";
import { PublicPage } from "../public-page";
import "../styles/button.scss";

/**
 * Component that welcomes the user and displays the options to register
 * and login.
 *
 * The user does not need to be logged in.
 *
 * If the user is offline, it disables the login and register buttons
 * and displays the offline warning.
 *
 * This page makes no network requests.
 */
export function Home() {
  const isOnline = useOnlineStatus();

  return (
    <PublicPage>
      <Container>
        <OfflineNotice isOffline={!isOnline} />
        <Row>
          <Col>
            <h1 className="text-center">Pocket Book</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Welcome to Pocket Book. You will need a St John Ambulance account
              to access this site.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              className="btn btn-dark-green btn-block"
              disabled={!isOnline}
              onClick={() => login()}
              id="log-in-button"
            >
              Log In
            </Button>
          </Col>
        </Row>
      </Container>
    </PublicPage>
  );
}
