import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Form from "reactstrap/lib/Form";
import FormFeedback from "reactstrap/lib/FormFeedback";
import Row from "reactstrap/lib/Row";
import { BusyButton } from "../busy-button";
import { Field } from "../field";
import { history } from "../history";
import { useSubmitData } from "../hooks/useSubmitData";
import { useValidation } from "../hooks/useValidation";
import { PasswordScore } from "../password-score";
import { PublicPage } from "../public-page";

const endpoint = "/api/reset-password";

interface IResetPasswordProps {
  userId: string;
  code: string;
}

/**
 * Component that allows the user to complete the reset process.
 *
 * The user must not be logged in.
 *
 * If the user is offline, it disables the submit button and
 * displays the offline warning.
 *
 * While the network request is running, it disables the submit
 * button and displays a "busy" indicator.
 * If the network request succeeds, it redirects to the forgot
 * success page.
 * If the network request fails with a validation error, it
 * flags the invalid field.
 * If the network request otherwise fails, it should display a
 * generic error message.
 */
export function ResetPassword(props: IResetPasswordProps) {
  const [
    newPassword,
    newPasswordValid,
    setNewPassword,
    setNewPasswordValid
  ] = useValidation("", "text");
  const [showValidation, setShowValidation] = useState(false);
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { submit, serverError, inProgress } = useSubmitData(
    { ...props, newPassword },
    { newPassword: newPasswordValid, userId: true, code: true },
    { newPassword: setNewPasswordValid },
    endpoint,
    {
      setShowValidation,
      success: () => {
        history.push("/login");
      }
    }
  );

  if (!props.code || !props.userId) {
    history.replace("/");
    return null;
  }

  const serverWarning =
    showValidation && serverError === true ? (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    ) : null;

  return (
    <PublicPage>
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Reset Your Password</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>
              Now we have confirmed your email address, you need to set a new
              password.
            </p>
          </Col>
        </Row>
        <Form id="reset-password-form" onSubmit={submit} noValidate={true}>
          {serverWarning}
          <Field
            placeholder="New Password"
            id="newPassword"
            name="newPassword"
            longText={false}
            showValidation={showValidation}
            valid={newPasswordValid}
            value={newPassword}
            warning="You need to enter a password."
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
          <BusyButton inProgress={inProgress} text="Submit" />
        </Form>
      </Container>
    </PublicPage>
  );
}
