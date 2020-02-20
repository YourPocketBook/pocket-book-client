import React, { useEffect, useState } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { Link } from "../link";
import { OfflineNotice } from "../offlineNotice";
import { PublicPage } from "../public-page";

/**
 * Component that handles the user confirming their email address after
 * registration.
 *
 * The user does not need to be logged in.
 *
 * If the user is offline, it waits until online and displays
 * the offline warning.
 *
 * While the network request is running it displays an in-progress message.
 * If the network request succeeds it displays a success message.
 * If the network request fails it displays a generic error message.
 */
export function ConfirmEmail({
  userId,
  code
}: {
  userId: string;
  code: string;
}) {
  const [error, setError] = useState(false);
  const [inProgress, setInProgress] = useState(true);
  const [isDone, setIsDone] = useState(false);

  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline || isDone) {
      return;
    }

    const fetchAbort = new AbortController();

    async function getData() {
      const uri = `/api/confirm-user?userId=${encodeURIComponent(
        userId
      )}&code=${encodeURIComponent(code)}`;

      try {
        const res = await fetch(uri, {
          method: "POST",
          signal: fetchAbort.signal
        });

        if (res.ok) {
          setError(false);
          setInProgress(false);
        } else {
          setError(true);
          setInProgress(false);
        }
      } catch (ex) {
        if (!fetchAbort.signal.aborted) {
          setError(true);
          setInProgress(false);
        }
      } finally {
        if (!fetchAbort.signal.aborted) {
          setIsDone(true);
        }
      }
    }

    getData();

    return () => fetchAbort.abort();
  }, [isOnline, isDone, code, userId]);

  let header;
  let text;
  let showHome = false;

  if (!isOnline && !isDone) {
    header = "Cannot Confirm - Offline";
    text = "You seem to be offline.  Go online and we will try again.";
  } else if (inProgress) {
    header = "Confirming Email Address";
    text =
      "Thanks for confirming your email, we are just updating our records.  Give us a moment please.";
  } else if (error) {
    header = "Failed to Confirm";
    text =
      "Sorry, that hasn't worked for some reason. Try the link in your email again, and if it fails again, it might be too old. Try to log in, you will be sent a fresh link.";
    showHome = true;
  } else {
    header = "Email Address Confirmed";
    text =
      "Thanks, you have confirmed your email address. You can now sign in.";
    showHome = true;
  }

  return (
    <PublicPage>
      <OfflineNotice isOffline={!isOnline} />
      <h1 className="header1">{header}</h1>
      <p className="main-text">{text}</p>
      {showHome && (
        <Link className="btn btn-dark-green" href="/" id="home-button">
          Home
        </Link>
      )}
    </PublicPage>
  );
}
