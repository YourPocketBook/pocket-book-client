import EmailValidator from "email-validator";
import { useState } from "react";

/**
 * Sets up a state variable that is also validated
 *
 * - "text" - No content validation is run on the text
 * - "email" - The value is checked to be a valid email address
 *
 * @param initialValue The initial value of the state variable
 * @param type The type of validation to run on the variable
 * @param required The value must be non-empty
 * @returns The current value, the validation status, the set function for the current value and the set function
 * for the validation status, in that order.
 */
export function useValidation(
  initialValue: string,
  type: "text" | "email"
): [string, boolean, (value: string) => void, (value: boolean) => void] {
  function checkIsValid(val: string) {
    if (val.trim().length === 0) {
      return false;
    }
    if (type === "email") {
      return EmailValidator.validate(val);
    }

    return true;
  }

  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState(checkIsValid(initialValue));

  function setValidationValue(val: string) {
    setValid(checkIsValid(val));
    setValue(val);
  }

  return [value, valid, setValidationValue, setValid];
}
