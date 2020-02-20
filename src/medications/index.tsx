import React from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import styles from "../dashboard/dashboard.module.scss";
import { useMedicationList } from "../hooks/useMedications";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { PrivatePage } from "../private-page";

/**
 * Component that displays the list of medications to the user.
 *
 * Invalid or expired token is handled by [[PrivatePage]]
 *
 * If the user is offline, it displays the offline warning.
 *
 * If the load into state returns nothing or fails, it displays
 * an error message.
 */
export function Medications() {
  const { medications, isLoading, serverError } = useMedicationList();
  const isOnline = useOnlineStatus();

  let content;

  if (isLoading && medications.length === 0) {
    content = (
      <Row className={styles.dashboardButton}>
        <Col>
          <div className="btn btn-dark-green btn-block btn-lg btn-disabled">
            Loading...
          </div>
        </Col>
      </Row>
    );
  } else {
    if (medications && medications.length > 0) {
      content = medications
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(m => (
          <Row key={m.id} className={styles.dashboardButton}>
            <Col>
              <Link
                className="btn btn-dark-green btn-block btn-lg text-capitalize"
                disabled={!isOnline && !m.availableOffline}
                href={`/medication/${m.id}`}
              >
                {m.name.toLowerCase()}
              </Link>
            </Col>
          </Row>
        ));
    } else if (serverError) {
      content = (
        <Row className={styles.dashboardButton}>
          <Col>
            <div className="btn btn-dark-green btn-block btn-lg">
              Failed to get Medications
            </div>
          </Col>
        </Row>
      );
    } else {
      content = (
        <Row className={styles.dashboardButton}>
          <Col>
            <div className="btn btn-dark-green btn-block btn-lg">
              No Medications
            </div>
          </Col>
        </Row>
      );
    }
  }

  return (
    <PrivatePage>
      <Container>
        <Row>
          <Col lg={{ size: 6, offset: 3 }}>
            <div className={styles.dashboardBackground}>
              <Container>
                <Row>
                  <Col>
                    <h1 className="text-center">Medications</h1>
                  </Col>
                </Row>
                {content}
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
