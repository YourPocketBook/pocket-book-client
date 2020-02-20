import React from "react";
import Alert from "reactstrap/lib/Alert";

/**
 * Component that displays a notification if the user is offline.
 */
export function OfflineNotice({ isOffline }: { isOffline: boolean }) {
  return isOffline ? (
    <Alert color="dark">You appear to be offline.</Alert>
  ) : null;
}
