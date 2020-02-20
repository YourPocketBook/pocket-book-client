import { useEffect, useState } from "react";
import { fetcher } from "../fetcher";
import { IMedication } from "../model/medication";
import { useOnlineStatus } from "./useOnlineStatus";

const medicationsKey = "medications";
const listEndpoint = "/api/get-medications";
const detailEndpoint = "/api/get-medication";

export function useMedicationList() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const isOnline = useOnlineStatus();

  const localStoreString = localStorage.getItem(medicationsKey);
  const localData = localStoreString
    ? (JSON.parse(localStoreString) as Array<Partial<IMedication>>)
    : [];
  const [medicationList, setMedicationList] = useState(localData);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const fetchAbort = new AbortController();

    const options = {
      method: "GET",
      signal: fetchAbort.signal
    };

    setIsLoading(true);

    async function func() {
      try {
        const res = await fetcher.authFetch(listEndpoint, options);

        if (fetchAbort.signal.aborted) {
          return;
        }

        if (res.ok) {
          const data = (await res.json()) as Array<Partial<IMedication>>;

          if (fetchAbort.signal.aborted) {
            return;
          }

          const cacheString = localStorage.getItem(medicationsKey);
          const oldData = cacheString
            ? (JSON.parse(cacheString) as Array<Partial<IMedication>>)
            : [];

          const currentIds = data
            .filter(m => m && m.id)
            .map(m => m.id as number);
          const previousIds = oldData
            .filter(m => m && m.id)
            .map(m => m.id as number);

          const updatedItems = oldData
            .filter(m => currentIds.includes(m.id as number))
            .map(m => {
              const update = data.find(n => n.id === m.id);
              if (update && update.name) {
                m.name = update.name;
              }
              return m;
            })
            .concat(data.filter(m => !previousIds.includes(m.id as number)));

          setMedicationList(updatedItems);
          localStorage.setItem(medicationsKey, JSON.stringify(updatedItems));
          setUpdateAvailable(true);
          setServerError(false);
        } else {
          setServerError(true);
        }
      } catch (ex) {
        if (!fetchAbort.signal.aborted) {
          setServerError(true);
        }
      } finally {
        if (!fetchAbort.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    func();

    return () => fetchAbort.abort();
  }, [isOnline]);

  return {
    isLoading,
    medications: medicationList
      .filter(m => m && m.id)
      .map(m => ({
        availableOffline: !!m.inclusionCriteria,
        id: m.id as number,
        name: m.name as string
      })),
    serverError,
    updateAvailable
  };
}

export function useMedication(id: string, refresh: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const isOnline = useOnlineStatus();

  const localStoreString = localStorage.getItem(medicationsKey);
  const data = localStoreString
    ? (JSON.parse(localStoreString) as Array<Partial<IMedication>>)
    : undefined;
  const med = data ? data.find(m => m.id === parseInt(id, 10)) : undefined;
  const [medication, setMedication] = useState(med);

  useEffect(() => {
    if (!isOnline) {
      return;
    }

    const fetchAbort = new AbortController();

    const options = {
      cache: refresh ? ("no-cache" as "no-cache") : undefined,
      method: "GET",
      signal: fetchAbort.signal
    };

    setIsLoading(true);
    setLoadFailed(false);

    async function func() {
      try {
        const res = await fetcher.authFetch(`${detailEndpoint}/${id}`, options);

        if (fetchAbort.signal.aborted) {
          return;
        }

        if (res.ok) {
          const newData = (await res.json()) as IMedication;

          if (fetchAbort.signal.aborted) {
            return;
          }

          setMedication(newData);
          cacheMedication(newData);
          setUpdateAvailable(true);
        } else {
          setLoadFailed(true);
        }
      } catch (ex) {
        if (!fetchAbort.signal.aborted) {
          // tslint:disable-next-line:no-console
          console.log(`Could not get from ${detailEndpoint}/${id}`);
          setLoadFailed(true);
        }
      } finally {
        if (!fetchAbort.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    func();

    return () => fetchAbort.abort();
  }, [isOnline, id, refresh]);

  return {
    isLoading,
    loadFailed,
    medication,
    updateAvailable
  };
}

export function cacheMedication(medication: IMedication) {
  const localStoreString = localStorage.getItem(medicationsKey);

  const data = localStoreString
    ? (JSON.parse(localStoreString) as Array<Partial<IMedication>>)
    : undefined;

  let newList: Array<Partial<IMedication>>;

  if (data) {
    newList = data.map(m => (m.id === medication.id ? medication : m));
  } else {
    newList = [medication];
  }

  localStorage.setItem(medicationsKey, JSON.stringify(newList));
}
