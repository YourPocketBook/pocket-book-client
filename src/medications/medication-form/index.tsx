import React, { useState } from "react";
import FormFeedback from "reactstrap/lib/FormFeedback";
import { BusyButton } from "../../busy-button";
import { Field } from "../../field";
import { history } from "../../history";
import { cacheMedication } from "../../hooks/useMedications";
import { useSubmitData } from "../../hooks/useSubmitData";
import { IMedication } from "../../model/medication";

export type IEditMedication = Omit<IMedication, "id">;
export type IEditMedicationValid = { [P in keyof IEditMedication]: boolean };

interface IMedicationFormProps {
  state: IEditMedication;
  valid: IEditMedicationValid;
  method: "POST" | "PUT";
  uri: string;
  dispatch(
    params: { prop: keyof IEditMedication } & (
      | { op: "update"; value: string }
      | {
          op: "invalidate";
        }
      | { op: "setValid"; value: boolean }
    )
  ): void;
}

export function MedicationForm({
  state,
  dispatch,
  valid,
  method,
  uri
}: IMedicationFormProps) {
  const [showValidation, setShowValidation] = useState(false);
  const [nameNotUnique, setNameNotUnique] = useState(false);
  const { submit, serverError, inProgress } = useSubmitData(
    state,
    valid,
    {
      adviceIfDeclined: v =>
        dispatch({ op: "setValid", prop: "adviceIfDeclined", value: v }),
      adviceIfTaken: v =>
        dispatch({ op: "setValid", prop: "adviceIfTaken", value: v }),
      dose: v => dispatch({ op: "setValid", prop: "dose", value: v }),
      exclusionCriteria: v =>
        dispatch({ op: "setValid", prop: "exclusionCriteria", value: v }),
      form: v => dispatch({ op: "setValid", prop: "form", value: v }),
      inclusionCriteria: v =>
        dispatch({ op: "setValid", prop: "inclusionCriteria", value: v }),
      indications: v =>
        dispatch({ op: "setValid", prop: "indications", value: v }),
      name: v => dispatch({ op: "setValid", prop: "name", value: v }),
      policyDate: v =>
        dispatch({ op: "setValid", prop: "policyDate", value: v }),
      route: v => dispatch({ op: "setValid", prop: "route", value: v }),
      sideEffects: v =>
        dispatch({ op: "setValid", prop: "sideEffects", value: v })
    },
    uri,
    {
      authenticate: true,
      customVal: {
        name: e => {
          if (e === "isInUse") {
            dispatch({ op: "invalidate", prop: "name" });
            setNameNotUnique(true);
          }
        }
      },
      method,
      setShowValidation,
      success: (res: { id: string }) => {
        cacheMedication({ id: parseInt(res.id, 10), ...state });
        history.push(`/medication/${res.id}?reload=true`);
      }
    }
  );

  const serverWarning =
    showValidation && serverError === true ? (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    ) : null;

  return (
    <form onSubmit={submit} noValidate={true}>
      {serverWarning}
      <Field
        placeholder="Name"
        id="name"
        name="name"
        longText={false}
        showValidation={showValidation}
        valid={valid.name}
        value={state.name}
        warning={
          nameNotUnique
            ? "That name is already in use"
            : "You need to enter the name of the medication."
        }
        onChange={e => {
          dispatch({ op: "update", prop: "name", value: e });
          setNameNotUnique(false);
        }}
      />
      <Field
        placeholder="Policy Date"
        id="policyDate"
        name="policyDate"
        longText={false}
        type="date"
        showValidation={showValidation}
        valid={valid.policyDate}
        value={state.policyDate || ""}
        warning="You need to enter the date of the policy this is taken from."
        onChange={e => {
          dispatch({ op: "update", prop: "policyDate", value: e });
        }}
      />
      <h2 className="h5">Clinical Condition</h2>
      <Field
        placeholder="Indications"
        id="indications"
        name="indications"
        longText={true}
        showValidation={showValidation}
        valid={valid.indications}
        value={state.indications}
        warning="You need to enter the indications for the medication."
        onChange={e =>
          dispatch({ op: "update", prop: "indications", value: e })
        }
      />
      <Field
        placeholder="Inclusion Criteria"
        id="inclusionCriteria"
        name="inclusionCriteria"
        longText={true}
        showValidation={showValidation}
        valid={valid.inclusionCriteria}
        value={state.inclusionCriteria}
        warning="You need to enter the inclusion criteria for the medication."
        onChange={e =>
          dispatch({ op: "update", prop: "inclusionCriteria", value: e })
        }
      />
      <Field
        placeholder="Exclusion Criteria"
        id="exclusionCriteria"
        name="exclusionCriteria"
        longText={true}
        showValidation={showValidation}
        valid={valid.exclusionCriteria}
        value={state.exclusionCriteria}
        warning="You need to enter the exclusion criteria for the medication."
        onChange={e =>
          dispatch({ op: "update", prop: "exclusionCriteria", value: e })
        }
      />
      <h2 className="h5">Medicine Details</h2>
      <Field
        placeholder="Name, Forms and Strengths of Medicine"
        id="form"
        name="form"
        longText={true}
        showValidation={showValidation}
        valid={valid.form}
        value={state.form}
        warning="You need to enter the name, forms and strengths of the medication."
        onChange={e => dispatch({ op: "update", prop: "form", value: e })}
      />
      <Field
        placeholder="Route or Method"
        id="route"
        name="route"
        longText={true}
        showValidation={showValidation}
        valid={valid.route}
        value={state.route}
        warning="You need to enter the route or method for the medication."
        onChange={e => dispatch({ op: "update", prop: "route", value: e })}
      />
      <Field
        placeholder="Dosage"
        id="dose"
        name="dose"
        longText={true}
        showValidation={showValidation}
        valid={valid.dose}
        value={state.dose}
        warning="You need to enter the dose for the medication."
        onChange={e => dispatch({ op: "update", prop: "dose", value: e })}
      />
      <Field
        placeholder="Side Effects"
        id="sideEffects"
        name="sideEffects"
        longText={true}
        showValidation={showValidation}
        valid={valid.sideEffects}
        value={state.sideEffects}
        warning="You need to enter the side effects of the medication."
        onChange={e =>
          dispatch({ op: "update", prop: "sideEffects", value: e })
        }
      />
      <Field
        placeholder="Advice if Taken"
        id="adviceIfTaken"
        name="adviceIfTaken"
        longText={true}
        showValidation={showValidation}
        valid={valid.adviceIfTaken}
        value={state.adviceIfTaken}
        warning="You need to enter the advice to give if the medication is taken."
        onChange={e =>
          dispatch({ op: "update", prop: "adviceIfTaken", value: e })
        }
      />
      <Field
        placeholder="Advice if Declined"
        id="adviceIfDeclined"
        name="adviceIfDeclined"
        longText={true}
        showValidation={showValidation}
        valid={valid.adviceIfDeclined}
        value={state.adviceIfDeclined}
        warning="You need to enter the advice to give if the medication is declined."
        onChange={e =>
          dispatch({ op: "update", prop: "adviceIfDeclined", value: e })
        }
      />
      <BusyButton inProgress={inProgress} />
    </form>
  );
}
