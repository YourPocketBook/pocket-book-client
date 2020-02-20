import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Form from "reactstrap/lib/Form";
import FormFeedback from "reactstrap/lib/FormFeedback";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import Row from "reactstrap/lib/Row";
import { Field } from "../field";
import { useSubmitData } from "../hooks/useSubmitData";
import { useValidation } from "../hooks/useValidation";
import { PasswordScore } from "../password-score";

const endPoint = "/api/update-password";

interface IEditPasswordModalProps {
  show: boolean;
  setShow(val: boolean): void;
  done(): void;
}

export function EditPasswordModal(props: IEditPasswordModalProps) {
  const { done, show, setShow } = props;

  const [
    currentPassword,
    currentPasswordValid,
    setCurrentPassword,
    setCurrentPasswordValid
  ] = useValidation("", "text");
  const [
    newPassword,
    newPasswordValid,
    setNewPassword,
    setNewPasswordValid
  ] = useValidation("", "text");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false);

  const [showValidation, setShowValidation] = useState(false);

  const { serverError, inProgress, submit } = useSubmitData(
    { currentPassword, newPassword },
    { currentPassword: currentPasswordValid, newPassword: newPasswordValid },
    {
      currentPassword: setCurrentPasswordValid,
      newPassword: setNewPasswordValid
    },
    endPoint,
    {
      authenticate: true,
      method: "PUT",
      setShowValidation,
      success: () => {
        setCurrentPassword("");
        setNewPassword("");
        setShowPassword(false);
        setShow(false);
        done();
      }
    }
  );

  const serverWarning =
    showValidation && serverError ? (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    ) : null;

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)}>
      <ModalHeader>Update your password</ModalHeader>
      <ModalBody>
        <Form onSubmit={submit}>
          {serverWarning}
          <Field
            placeholder="Current Password"
            id="currentPassword"
            name="currentPassword"
            longText={false}
            showValidation={showValidation}
            valid={currentPasswordValid}
            value={currentPassword}
            warning="You need to enter your current password."
            onChange={setCurrentPassword}
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
          />
          <Field
            placeholder="New Password"
            id="newPassword"
            name="newPassword"
            longText={false}
            showValidation={showValidation}
            valid={newPasswordValid}
            value={newPassword}
            warning="You need to enter a new password."
            onChange={s => {
              setNewPassword(s);
              setShowPasswordSuggestions(true);
            }}
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
          />
          <Row>
            <Col md={{ size: 9, offset: 3 }} className="text-right">
              <Button
                color="link"
                id="showPassword"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </Button>
            </Col>
          </Row>
          <PasswordScore
            password={newPassword}
            show={showPasswordSuggestions}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="dark-green"
          disabled={inProgress}
          // tslint:disable-next-line:no-empty
          onClick={() => submit({ preventDefault: () => {} })}
        >
          Save
        </Button>
        <Button
          color="secondary"
          onClick={() => {
            setShow(false);
            setCurrentPassword("");
            setNewPassword("");
            setShowPassword(false);
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
