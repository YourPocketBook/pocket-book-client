import { useState } from "react";
import { fetcher } from "../fetcher";

type IIsValid<T> = { [P in keyof T]: boolean };
type ISetIsValid<T> = { [P in keyof T]?: (val: boolean) => void };
type ISetCustomValid<T> = { [P in keyof T]?: (val: string) => void };

/**
 * Hook that handles submitting form data and responding to server-side validation.
 *
 * @param value Object that contains the current values to send to the server
 * @param valid Object that contains the validation status of each item in value
 * @param setValid Object that contains a set function for each item in valid
 * @param url The URI the data should be submitted to
 * @param options The options to control the submitting
 */
export function useSubmitData<TData extends object>(
  value: TData,
  valid: IIsValid<TData>,
  setValid: ISetIsValid<TData>,
  url: string,
  options: {
    setShowValidation?: any;
    method?: "PUT" | "POST";
    authenticate?: boolean;
    customVal?: ISetCustomValid<TData>;
    success?(arg?: {}): void;
  } = {}
) {
  const [serverError, setServerError] = useState(false);
  const [notAuthorised, setNotAuthorised] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  async function submit(e: { preventDefault(): void }) {
    e.preventDefault();

    for (const prop in value) {
      if (value.hasOwnProperty(prop) && valid.hasOwnProperty(prop)) {
        if (!valid[prop]) {
          if (options.setShowValidation) {
            options.setShowValidation(true);
          }
          return;
        }
      }
    }

    if (options.setShowValidation) {
      options.setShowValidation(false);
    }

    setServerError(false);
    setNotAuthorised(false);
    setInProgress(true);

    const method = options.method ? options.method : "POST";

    const requestOptions = {
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json"
      },
      method
    };

    try {
      const res = options.authenticate
        ? await fetcher.authFetch(url, requestOptions)
        : await fetch(url, requestOptions);

      if (res.ok) {
        if (options.success) {
          if (res.status !== 204) {
            options.success(await res.json());
          } else {
            options.success();
          }
        }
      } else {
        if (options.setShowValidation) {
          options.setShowValidation(true);
        }

        if (res.status === 400 || res.status === 409 || res.status === 403) {
          const body = (await res.json()) as Array<{
            path: keyof TData;
            error: "isBlank" | "isInvalid";
          }>;

          for (const b of body) {
            if (b.error === "isBlank" || b.error === "isInvalid") {
              const validFunc = setValid[b.path];

              if (validFunc) {
                validFunc(false);
              }
            } else if (options.customVal) {
              const func = options.customVal[b.path];
              if (func) {
                func(b.error);
              }
            }
          }
        } else if (res.status === 401) {
          setNotAuthorised(true);
        } else {
          setServerError(true);
        }
      }
    } finally {
      setInProgress(false);
    }
  }

  return { submit, serverError, notAuthorised, inProgress };
}
