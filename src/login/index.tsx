import React, { useEffect } from "react";
import { useState } from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Form from "reactstrap/lib/Form";
import FormFeedback from "reactstrap/lib/FormFeedback";
import Row from "reactstrap/lib/Row";
import { BusyButton } from "../busy-button";
import { fetcher } from "../fetcher";
import { Field } from "../field";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useSubmitData } from "../hooks/useSubmitData";
import { useValidation } from "../hooks/useValidation";
import { Link } from "../link";
import { PublicPage } from "../public-page";
import "../styles/validation.css";

const endpoint = "/api/login";

/**
 * Component that allows the user to log in to the system.
 *
 * The user does not need to be logged in.
 *
 * If the user is offline, they should be redirected to the
 * home page which will explain that they are offline.
 *
 * While the network request is running, it disables the login button
 * and displays a "busy" indicator.
 * If the network request succeeds, it redirects to the dashboard.
 * If the network request fails with a validation error, it flags
 * the invalid field.
 * If the network request fails with not authorized, it should
 * flag invalid username or password but not mark the fields invalid.
 * If the network request fails with not confirmed, it should
 * show a message and not mark the field invalid.
 * If the network request otherwise fails, it should display a generic
 * error message.
 */
export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const [email, emailValid, setEmail, setEmailValid] = useValidation(
    "",
    "email"
  );
  const [
    password,
    passwordValid,
    setPassword,
    setPasswordValid
  ] = useValidation("", "text");

  const { submit, serverError, notAuthorised, inProgress } = useSubmitData(
    { email, password },
    { email: emailValid, password: passwordValid },
    { email: setEmailValid, password: setPasswordValid },
    endpoint,
    {
      authenticate: false,
      customVal: {
        email: (err: string) => {
          if (err === "emailNotConfirmed") {
            setEmailNotConfirmed(true);
          }
        }
      },
      setShowValidation,
      success: (result: { token: string }) => {
        fetcher.saveToken(result.token);
        history.push("/home");
      }
    }
  );

  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      history.push("/");
    }
  }, [isOnline]);

  let serverWarning = null;

  if (showValidation && notAuthorised) {
    serverWarning = (
      <FormFeedback className="d-block">
        That username and password was not recognised, please try again.
      </FormFeedback>
    );
  } else if (showValidation && emailNotConfirmed) {
    serverWarning = (
      <FormFeedback className="d-block">
        Your email hasn't been confirmed. Have a look in your inbox, there
        should be an email explaining what to do next.
      </FormFeedback>
    );
  } else if (showValidation && serverError) {
    serverWarning = (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    );
  }

  const showPasswordText = showPassword ? "Hide Password" : "Show Password";

  function changeEmail(value: string) {
    setEmail(value);
    if (!value.toLowerCase().endsWith("@sja.org.uk")) {
      setEmailValid(false);
    }
  }

  return (
    <PublicPage>
      <Container>
        <Form id="login-form" onSubmit={submit} noValidate={true}>
          <Row>
            <Col>
              <h1 className="text-center">Login</h1>
            </Col>
          </Row>
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
            onChange={changeEmail}
            autoComplete="email"
            type="email"
          />
          <Field
            placeholder="Password"
            id="password"
            name="password"
            longText={false}
            showValidation={showValidation}
            valid={passwordValid}
            value={password}
            warning="You need to enter a password."
            onChange={setPassword}
            autoComplete="current-password"
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
                {showPasswordText}
              </Button>
            </Col>
          </Row>
          <BusyButton inProgress={inProgress} text="Login" />
          <Link
            className="btn btn-light-green btn-block"
            href="/forgot-password"
            id="log-in-button"
          >
            Reset Password
          </Link>
        </Form>
      </Container>
    </PublicPage>
  );
}
