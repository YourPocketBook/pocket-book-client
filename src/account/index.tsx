import React, { useEffect, useState } from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import Toast from "reactstrap/lib/Toast";
import ToastBody from "reactstrap/lib/ToastBody";
import { fetcher } from "../fetcher";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { OfflineNotice } from "../offlineNotice";
import { PrivatePage } from "../private-page";
import "../styles/button.scss";
import "../styles/headers.css";
import styles from "./account.module.scss";
import { DeleteModal } from "./delete-modal";
import { EditNameModal } from "./edit-name-modal";
import { EditPasswordModal } from "./edit-password-modal";

const getEmailSettingsEndPoint = "/api/get-email-settings";
const setEmailSettingsEndPoint = "/api/update-email-settings";

/**
 * Component that displays the administration tools to the user.
 *
 * Invalid or expired token is handled by [[PrivatePage]].
 *
 * If the user is offline, it disables the buttons and displays the offline warning.
 *
 * While the delete request is running, it disables the button and displays a "busy" indicator.
 * When the delete request completes, it removes the current token and redirects to the login page.
 * While the toggle email setting request is running, it disables the button and displays a "busy" indicator.
 * When the email setting completes, it updates the button.
 */
export function Account() {
  const isOnline = useOnlineStatus();
  const [isLoadingEmailSettings, setIsLoadingEmailSettings] = useState(false);
  const [emailConsentGiven, setEmailConsentGiven] = useState(undefined as
    | boolean
    | undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditName, setShowEditName] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showPasswordToast, setShowPasswordToast] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    async function func() {
      setIsLoadingEmailSettings(true);
      try {
        const res = await fetcher.authFetch(getEmailSettingsEndPoint);

        if (res.ok) {
          const obj = await res.json();
          setEmailConsentGiven(obj.updateEmailConsentGiven);
        }
      } catch {
        setEmailConsentGiven(undefined);
      } finally {
        setIsLoadingEmailSettings(false);
      }
    }

    func();
  }, [isOnline]);

  async function toggleEmailConsent() {
    setIsLoadingEmailSettings(true);

    try {
      const res = await fetcher.authFetch(setEmailSettingsEndPoint, {
        body: JSON.stringify({
          updateEmailConsentGiven: !emailConsentGiven
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT"
      });

      if (res.ok) {
        setEmailConsentGiven(!emailConsentGiven);
      }
      setIsLoadingEmailSettings(false);
    } catch {
      setIsLoadingEmailSettings(false);
    }
  }

  let consentText = "";

  if (isLoadingEmailSettings) {
    consentText = "One Moment...";
  } else if (emailConsentGiven === true) {
    consentText = "Disable Update Emails";
  } else if (emailConsentGiven === false) {
    consentText = "Enable Update Emails";
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
                    <h1 className="text-center">Account</h1>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Button
                      color="dark-green"
                      block
                      size="lg"
                      disabled={!isOnline}
                      onClick={() => {
                        setShowEditName(true);
                      }}
                    >
                      Change Name
                    </Button>
                  </Col>
                </Row>
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Button
                      color="dark-green"
                      block
                      size="lg"
                      disabled={!isOnline}
                      onClick={() => {
                        setShowEditPassword(true);
                      }}
                    >
                      Change Password
                    </Button>
                  </Col>
                </Row>
                {isLoadingEmailSettings || emailConsentGiven !== undefined ? (
                  <Row className={styles.dashboardButton}>
                    <Col>
                      <Button
                        color="dark-green"
                        block
                        size="lg"
                        disabled={!isOnline || isLoadingEmailSettings}
                        onClick={toggleEmailConsent}
                      >
                        {consentText}
                      </Button>
                    </Col>
                  </Row>
                ) : null}
                <Row className={styles.dashboardButton}>
                  <Col>
                    <Button
                      color="danger"
                      block
                      size="lg"
                      disabled={!isOnline}
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      Delete Account
                    </Button>
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
        <Row>
          <Col />
          <Col>
            <Toast
              isOpen={showPasswordToast}
              onClick={() => setShowPasswordToast(false)}
            >
              <ToastBody className="text-center font-weight-bold">
                Password Updated
              </ToastBody>
            </Toast>
          </Col>
          <Col />
        </Row>
      </Container>
      <DeleteModal setShow={setShowDeleteConfirm} show={showDeleteConfirm} />
      <EditNameModal
        initialName={fetcher.getName()}
        setShow={setShowEditName}
        show={showEditName}
      />
      <EditPasswordModal
        setShow={setShowEditPassword}
        show={showEditPassword}
        done={() => {
          setShowPasswordToast(true);
        }}
      />
    </PrivatePage>
  );
}
