import React from "react";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Row from "reactstrap/lib/Row";
import { useEditMedication } from "../../hooks/useEditMedication";
import { useLoadIntoEditableState } from "../../hooks/useLoadIntoState";
import { PrivatePage } from "../../private-page";
import { IEditMedication, MedicationForm } from "../medication-form";
import styles from "./edit-medication.module.scss";

const editEndpoint = "/api/update-medication";
const getEndpoint = "/api/get-medication";

/**
 * Component that allows the user to edit a medication.
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
export function EditMedication({ id }: { id: string }) {
  const { state, dispatch } = useEditMedication();

  const isLoading = useLoadIntoEditableState<IEditMedication>(
    `${getEndpoint}/${id}`,
    dispatch,
    true
  );

  const { valid, ...rest } = state;

  let content;

  if (isLoading) {
    content = <div>One moment please...</div>;
  } else {
    content = (
      <MedicationForm
        state={rest}
        valid={valid}
        dispatch={dispatch}
        method="PUT"
        uri={`${editEndpoint}/${id}`}
      />
    );
  }

  return (
    <PrivatePage>
      <Container className={styles.formBackground}>
        <Row>
          <Col>
            <h1 className="text-center">Edit Medication</h1>
          </Col>
        </Row>
        {content}
      </Container>
    </PrivatePage>
  );
}
