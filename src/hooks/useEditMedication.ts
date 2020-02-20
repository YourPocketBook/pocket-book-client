import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import { useReducer } from "react";
import {
  IEditMedication,
  IEditMedicationValid
} from "../medications/medication-form";

export function useEditMedication() {
  const [state, dispatch] = useReducer(
    (
      s: IEditMedication & { valid: IEditMedicationValid },
      a: { prop: keyof IEditMedication } & (
        | { op: "update"; value: string | undefined | null }
        | {
            op: "invalidate";
          }
        | { op: "setValid"; value: boolean }
      )
    ) => {
      if (s.hasOwnProperty(a.prop)) {
        const newData = { ...s };

        switch (a.op) {
          case "update":
            newData[a.prop] = a.value || "";
            if (a.prop === "policyDate") {
              newData.valid[a.prop] = !!a.value && isValid(parseISO(a.value));
            } else {
              newData.valid[a.prop] = !!a.value && a.value.length > 0;
            }
            break;
          case "invalidate":
            newData.valid[a.prop] = false;
            break;
          case "setValid":
            newData.valid[a.prop] = a.value;
            break;
        }
        return newData;
      }
      return s;
    },
    {
      adviceIfDeclined: "",
      adviceIfTaken: "",
      dose: "",
      exclusionCriteria: "",
      form: "",
      inclusionCriteria: "",
      indications: "",
      name: "",
      policyDate: "",
      route: "",
      sideEffects: "",
      valid: {
        adviceIfDeclined: false,
        adviceIfTaken: false,
        dose: false,
        exclusionCriteria: false,
        form: false,
        inclusionCriteria: false,
        indications: false,
        name: false,
        policyDate: false,
        route: false,
        sideEffects: false
      }
    }
  );

  return { state, dispatch };
}
