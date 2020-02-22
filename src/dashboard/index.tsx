import React from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { logout } from "../ms-login";
import { OfflineNotice } from "../offlineNotice";
import { PrivatePage } from "../private-page";
import styles from "./dashboard.module.scss";

/**
 * Component that displays the user the main menu options.
 *
 * Invalid or expired token is handled by [[PrivatePage]].
 *
 * If the user is offline, it displays the offline warning.
 *
 * This page makes no network requests.
 */
export function Dashboard() {
  const isOnline = useOnlineStatus();

  function onLogoutClick() {
    logout();
  }

  return (
    <PrivatePage>
      <Container>
        <OfflineNotice isOffline={!isOnline} />
        <Row>
          <Col lg={{ size: 6, offset: 3 }}>
            <div className={styles.dashboardBackground}>
              <Container>
                <Row>
                  <Col>
                    <h1 className="text-center">PocketBook</h1>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Link
                      className="btn btn-dark-green btn-block btn-lg"
                      href="/medications"
                    >
                      Medications
                    </Link>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Button
                      size="lg"
                      color="dark-green"
                      block={true}
                      className="sign-out"
                      onClick={onLogoutClick}
                    >
                      Sign Out
                    </Button>
                  </Col>
                </Row>
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </PrivatePage>
  );
}
