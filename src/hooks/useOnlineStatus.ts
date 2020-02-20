// Included from https://github.com/21kb/react-hooks/blob/master/packages/react-online-status-hook
//
// Copyright © 2018 Kunall Banerjee
// MIT License

import { useEffect, useState } from "react";

export function useOnlineStatus() {
  const [state, setState] = useState(navigator.onLine);

  const onOnlineEvent = () => {
    setState(navigator.onLine);
  };

  const onOfflineEvent = () => {
    setState(navigator.onLine);
  };

  useEffect(() => {
    window.addEventListener("online", onOnlineEvent);
    window.addEventListener("offline", onOfflineEvent);

    return () => {
      window.removeEventListener("online", onOnlineEvent);
      window.removeEventListener("offline", onOfflineEvent);
    };
  });

  return state;
}
