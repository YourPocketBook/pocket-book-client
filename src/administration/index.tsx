import React from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { OfflineNotice } from "../offlineNotice";
import { PrivatePage } from "../private-page";
import "../styles/button.scss";
import "../styles/headers.css";
import styles from "./administration.module.scss";

/**
 * Component that displays the administration tools to the user.
 *
 * If the user is not an administrator, it redirects to the /home page
 * using [[useRequireAdmin]].  Invalid or expired token is handled
 * by [[PrivatePage]].
 *
 * If the user is offline, it disables the admin buttons and displays
 * the offline warning.
 *
 * This page makes no network requests.
 */
export function Administration() {
  if (!fetcher.isAdmin()) {
    history.push("/home");
  }

  const isOnline = useOnlineStatus();

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
                    <h1 className="text-center">Administration</h1>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Link
                      className="btn btn-dark-green btn-block btn-lg"
                      disabled={!isOnline}
                      href="/admin/new-medication"
                    >
                      New Medication
                    </Link>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Link
                      className="btn btn-dark-green btn-block btn-lg"
                      href="/home"
                    >
                      Home
                    </Link>
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
