import React from "react";
import { useState } from "react";
import Button from "reactstrap/lib/Button";
import Col from "reactstrap/lib/Col";
import Container from "reactstrap/lib/Container";
import Form from "reactstrap/lib/Form";
import FormFeedback from "reactstrap/lib/FormFeedback";
import FormGroup from "reactstrap/lib/FormGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";
import { BusyButton } from "../busy-button";
import { Field } from "../field";
import { history } from "../history";
import { useSubmitData } from "../hooks/useSubmitData";
import { useValidation } from "../hooks/useValidation";
import { Link } from "../link";
import { PasswordScore } from "../password-score";
import { PublicPage } from "../public-page";
import "../styles/validation.css";

const endpoint = "/api/register-user";

/**
 * Component that allows the user to create a user account.
 *
 * The user does not need to be logged in.
 *
 * If hte user is offline, it disables the submit button and displays the offline
 * warning.
 *
 * While the network request is running, it disables the submit button
 * and displays a "busy" indicator.
 * If the network request succeeds, it redirects to the register success page.
 * If the network request fails with a validation error, it flags the invalid field.
 * If the network request otherwise fails, it should display a generic error message.
 */
export function Register() {
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [email, emailValid, setEmail, setEmailValid] = useValidation(
    "",
    "email"
  );
  const [name, nameValid, setName, setNameValid] = useValidation("", "text");
  const [
    password,
    passwordValid,
    setPassword,
    setPasswordValid
  ] = useValidation("", "text");
  const [updateEmailConsentGiven, setUpdateEmailConsentGiven] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordSuggestions, setShowPasswordSuggestions] = useState(false);
  const [emailDuplicate, setEmailDuplicate] = useState(false);

  function handleDuplicateEmail(err: string) {
    if (err === "isInUse") {
      setEmailValid(false);
      setEmailDuplicate(true);
    }
  }

  const { submit, serverError, inProgress } = useSubmitData(
    { email, name, password, updateEmailConsentGiven },
    {
      email: emailValid,
      name: nameValid,
      password: passwordValid,
      updateEmailConsentGiven: true
    },
    {
      email: setEmailValid,
      name: setNameValid,
      password: setPasswordValid,
      updateEmailConsentGiven: () => {
        return;
      }
    },
    endpoint,
    {
      customVal: {
        email: handleDuplicateEmail
      },
      setShowValidation,
      success: () => {
        history.push("/register-success");
      }
    }
  );

  const emailValidation = emailDuplicate
    ? "That email is already in use"
    : "You need to give your SJA email";

  const serverWarning =
    showValidation && serverError === true ? (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    ) : null;

  function localSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!acceptPrivacy || !acceptTerms) {
      setShowValidation(true);
      return;
    }

    submit(e);
  }

  return (
    <PublicPage>
      <Container>
        <Row>
          <Col>
            <h1 className="text-center">Register</h1>
          </Col>
        </Row>
        <Form id="register-form" onSubmit={localSubmit} noValidate={true}>
          {serverWarning}
          <Field
            placeholder="Name"
            id="name"
            name="name"
            longText={false}
            showValidation={showValidation}
            valid={nameValid}
            value={name}
            warning="You need to give your name."
            onChange={setName}
            autoComplete="name"
          />
          <Field
            placeholder="Email"
            id="email"
            name="email"
            longText={false}
            showValidation={showValidation}
            valid={emailValid}
            value={email}
            warning={emailValidation}
            onChange={s => {
              setEmail(s.toLowerCase());
              if (!s.toLowerCase().endsWith("@sja.org.uk")) {
                setEmailValid(false);
              }
              setEmailDuplicate(false);
            }}
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
            onChange={s => {
              setPassword(s);
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
          <PasswordScore password={password} show={showPasswordSuggestions} />
          <FormGroup check={true}>
            <Label check={true}>
              <Input
                id="acceptPrivacy"
                type="checkbox"
                onChange={e => setAcceptPrivacy(e.target.checked)}
                checked={acceptPrivacy}
                valid={showValidation && acceptPrivacy}
                invalid={showValidation && !acceptPrivacy}
              />
              I have read and accept the{" "}
              <Link href="/privacy">Privacy Policy</Link>.
              <FormFeedback>
                You can't register if you don't accept this policy.
              </FormFeedback>
            </Label>
          </FormGroup>
          <FormGroup check={true}>
            <Label check={true}>
              <Input
                id="acceptTerms"
                type="checkbox"
                onChange={e => setAcceptTerms(e.target.checked)}
                checked={acceptTerms}
                valid={showValidation && acceptTerms}
                invalid={showValidation && !acceptTerms}
              />
              I have read and accept the{" "}
              <Link href="/privacy">Terms and Conditions of Use</Link>.
              <FormFeedback>
                You can't register if you don't accept this policy.
              </FormFeedback>
            </Label>
          </FormGroup>
          <FormGroup check={true}>
            <Label check={true} className="text-small">
              <Input
                id="acceptEmails"
                type="checkbox"
                onChange={e => setUpdateEmailConsentGiven(e.target.checked)}
                checked={updateEmailConsentGiven}
              />
              I consent to receive occasional emails when this site is updated.
              This is optional.
            </Label>
          </FormGroup>
          <BusyButton inProgress={inProgress} text="Register" />
        </Form>
      </Container>
    </PublicPage>
  );
}
