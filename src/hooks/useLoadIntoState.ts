import { Dispatch, useEffect, useState } from "react";
import { fetcher } from "../fetcher";

/**
 * Fetches JSON from the specified uri and loads each property into individually editable state variables
 *
 * @param uri The URI to load the data from
 * @param setState An object containing setState functions for each property
 * @param [authenticate=false] If set to true, the current token will be passed with the call
 * @returns True if the request is currently running, otherwise false.
 */
export function useLoadIntoEditableState<
  TData extends { [key: string]: string | undefined | null } & object
>(
  uri: string,
  dispatch: Dispatch<{
    op: "update";
    prop: keyof TData;
    value: string | undefined | null;
  }>,
  authenticate = false
): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbort = new AbortController();

    const options: RequestInit = {
      cache: "reload",
      method: "GET",
      signal: fetchAbort.signal
    };

    async function func() {
      try {
        const res = authenticate
          ? await fetcher.authFetch(uri, options)
          : await fetch(uri, options);

        if (res.ok) {
          const data = (await res.json()) as TData;
          for (const prop in data) {
            if (data.hasOwnProperty(prop)) {
              dispatch({ op: "update", prop, value: data[prop] });
            }
          }
        }
      } catch (ex) {
        if (!fetchAbort.signal.aborted) {
          // tslint:disable-next-line:no-console
          console.log(`Could not get from ${uri}.`);
        }
      } finally {
        if (!fetchAbort.signal.aborted) {
          setLoading(false);
        }
      }
    }

    func();
    return () => fetchAbort.abort();
  }, [uri, authenticate, dispatch]);

  return loading;
}
