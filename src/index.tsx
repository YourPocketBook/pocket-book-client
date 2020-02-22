import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";

import { Location } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Dashboard } from "./dashboard";
import { history } from "./history";
import { Home } from "./home";
import "./index.css";
import { LoginError } from "./login-error";
import { Medications } from "./medications";
import { Medication } from "./medications/medication";
import { PrivacyPolicy } from "./privacy-policy";
import { register as registerServiceWorker } from "./registerServiceWorker";
import { IRoute, resolve } from "./router";
import "./styles/style.scss";
import { TermsOfUse } from "./terms-of-use";

const container = document.getElementById("root");

function renderComponent(component: React.ReactNode) {
  ReactDOM.render(component as any, container);
}

const routes: IRoute[] = [
  { path: "/", action: () => <Home /> },
  { path: "/privacy", action: () => <PrivacyPolicy /> },
  { path: "/tsandcs", action: () => <TermsOfUse /> },
  { path: "/home", action: () => <Dashboard /> },
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
