import React from "react";
import { HideOnError } from "../hide-on-error";

const PS = React.lazy(() => import("./password-score"));

export function PasswordScore(props: { password: string; show: boolean }) {
  return (
    <HideOnError>
      <React.Suspense fallback={null}>
        <PS {...props} />
      </React.Suspense>
    </HideOnError>
  );
}
