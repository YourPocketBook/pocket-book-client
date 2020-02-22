import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

import { Location } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Account } from "./account";
import { Administration } from "./administration";
import { ConfirmEmail } from "./confirm-email";
import { Dashboard } from "./dashboard";
import { ForgotPassword } from "./forgot-password";
import { ForgotPasswordDone } from "./forgot-password-done";
import { history } from "./history";
import { Home } from "./home";
import "./index.css";
import { Login } from "./login";
import { LoginError } from "./login-error";
import { Medications } from "./medications";
import { EditMedication } from "./medications/edit-medication";
import { Medication } from "./medications/medication";
import { NewMedication } from "./medications/new-medication";
import { PrivacyPolicy } from "./privacy-policy";
import { Register } from "./register";
import { RegisterSuccess } from "./register-success";
import { register as registerServiceWorker } from "./registerServiceWorker";
import { ResetPassword } from "./reset-password";
import { IRoute, resolve } from "./router";
import "./styles/style.scss";
import { TermsOfUse } from "./terms-of-use";

const container = document.getElementById("root");

function renderComponent(component: React.ReactNode) {
  ReactDOM.render(component as any, container);
}

const routes: IRoute[] = [
  { path: "/", action: () => <Home /> },
  { path: "/register", action: () => <Register /> },
  {
    action: () => <RegisterSuccess />,
    path: "/register-success"
  },
  { path: "/privacy", action: () => <PrivacyPolicy /> },
  { path: "/tsandcs", action: () => <TermsOfUse /> },
  {
    action: (context: { code: string; userId: string }) => (
      <ConfirmEmail code={context.code} userId={context.userId} />
    ),
    path: "/confirm-email"
  },
  {
    action: (context: { code: string; userId: string }) => (
      <ResetPassword code={context.code} userId={context.userId} />
    ),
    path: "/reset-password"
  },
  { path: "/home", action: () => <Dashboard /> },
  { path: "/login", action: () => <Login /> },
  {
    action: () => <NewMedication />,
    path: "/admin/new-medication"
  },
  {
    action: (context: { params: { id: string } }) => (
      <EditMedication id={context.params.id} />
    ),
    path: "/admin/edit-medication/:id"
  },
  {
    action: () => <Medications />,
    path: "/medications"
  },
  {
    action: (context: { params: { id: string }; reload?: string }) => (
      <Medication id={context.params.id} reload={context.reload === "true"} />
    ),
    path: "/medication/:id"
  },
  {
    action: () => <Administration />,
    path: "/admin"
  },
  {
    action: () => <Account />,
    path: "/account"
  },
  { path: "/forgot-password", action: () => <ForgotPassword /> },
  { path: "/forgot-password-done", action: () => <ForgotPasswordDone /> },
  { path: "/login-error", action: () => <LoginError /> }
];

function render(location: Location) {
  resolve(routes, location)
    .then(renderComponent)
    .catch(error =>
      resolve(routes, { ...location, error }).then(renderComponent)
    );
}

render(history.location);
history.listen(render);

registerServiceWorker();
