import React from "react";
import { useMemo } from "react";
import FormText from "reactstrap/lib/FormText";
import zxcvbn from "zxcvbn";

export default function PasswordScore({
  password,
  show
}: {
  password: string;
  show: boolean;
}) {
  const res = useMemo(() => zxcvbn(password), [password]);
  const suggestions =
    res.feedback.suggestions.length > 0 && show ? (
      <FormText>
        Password Tips
        <ul>
          {res.feedback.suggestions.map(p => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </FormText>
    ) : null;

  return suggestions;
}
