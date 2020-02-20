import React from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { useEditMedication } from "../../hooks/useEditMedication";
import { PrivatePage } from "../../private-page";
import { MedicationForm } from "../medication-form";
import styles from "./new-medication.module.scss";

const endpoint = "/api/add-medication";

/**
 * Component that allows the user to create a medication.
 *
 * Invalid or expired token is handled by PrivatePage.
 *
 * If the user is not an administrator, it redirects to the /home page
 * using useRequireAdmin.  If the user is offline, it disables the submit button and displays
 * the offline warning.
 *
 * While the network request is running, it disables the submit button
 * and displays a "busy" indicator.
 * If the network request succeeds, it redirects to the medication.
 * If the network request fails with a validation error, it flags
 * the invalid field.
 * If the network request otherwise fails, it should display a generic
 * error message.
 */
export function NewMedication() {
  const { state, dispatch } = useEditMedication();

  const { valid, ...rest } = state;

  return (
    <PrivatePage>
      <Container className={styles.formBackground}>
        <Row>
          <Col>
            <h1 className="text-center">New Medication</h1>
          </Col>
        </Row>
        <MedicationForm
          state={rest}
          valid={valid}
          dispatch={dispatch}
          method="POST"
          uri={endpoint}
        />
      </Container>
    </PrivatePage>
  );
}
