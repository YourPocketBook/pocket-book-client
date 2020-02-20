import React, { useState } from "react";
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
import { PublicPage } from "../public-page";

const endpoint = "/api/forgot-password";

/**
 * Component that allows the user to start the reset process.
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
export function ForgotPassword() {
  const [email, emailValid, setEmail, setEmailValid] = useValidation(
    "",
    "email"
  );
  const [showValidation, setShowValidation] = useState(false);

  const { submit, serverError, inProgress } = useSubmitData(
    { email },
    { email: emailValid },
    { email: setEmailValid },
    endpoint,
    {
      setShowValidation,
      success: () => {
        history.push("/forgot-password-done");
      }
    }
  );

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
              Enter your email address and we will send you an email that will
              help you reset your password.
            </p>
          </Col>
        </Row>
        <Form id="register-form" onSubmit={submit} noValidate={true}>
          {serverWarning}
          <Field
            placeholder="Email"
            id="email"
            name="email"
            longText={false}
            showValidation={showValidation}
            valid={emailValid}
            value={email}
            warning="You need to give your SJA email."
            onChange={s => {
              setEmail(s.toLowerCase());
              if (!s.toLowerCase().endsWith("@sja.org.uk")) {
                setEmailValid(false);
              }
            }}
            autoComplete="email"
            type="email"
          />
          <BusyButton inProgress={inProgress} text="Submit" />
        </Form>
      </Container>
    </PublicPage>
  );
}
