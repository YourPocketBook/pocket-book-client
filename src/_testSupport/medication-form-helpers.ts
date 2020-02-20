import { fireEvent } from "@testing-library/react";

export const testDefaultState = {
  adviceIfDeclined: "Test Advice 1",
  adviceIfTaken: "Test Advice 2",
  dose: "Test Dose",
  exclusionCriteria: "Test Exclusion",
  form: "Test Form",
  inclusionCriteria: "Test Inclusion",
  indications: "Test Indications",
  name: "Test Name",
  policyDate: "2019-12-10",
  route: "Test Route",
  sideEffects: "Test Side Effects"
};

export function setupState(getByLabelText: (text: string) => HTMLElement) {
  fireEvent.change(getByLabelText("Name"), {
    target: { value: testDefaultState.name }
  });
  fireEvent.change(getByLabelText("Policy Date"), {
    target: { value: testDefaultState.policyDate }
  });
  fireEvent.change(getByLabelText("Indications"), {
    target: { value: testDefaultState.indications }
  });
  fireEvent.change(getByLabelText("Inclusion Criteria"), {
    target: { value: testDefaultState.inclusionCriteria }
  });
  fireEvent.change(getByLabelText("Exclusion Criteria"), {
    target: { value: testDefaultState.exclusionCriteria }
  });
  fireEvent.change(getByLabelText("Name, Forms and Strengths of Medicine"), {
    target: { value: testDefaultState.form }
  });
  fireEvent.change(getByLabelText("Route or Method"), {
    target: { value: testDefaultState.route }
  });
  fireEvent.change(getByLabelText("Dosage"), {
    target: { value: testDefaultState.dose }
  });
  fireEvent.change(getByLabelText("Side Effects"), {
    target: { value: testDefaultState.sideEffects }
  });
  fireEvent.change(getByLabelText("Advice if Taken"), {
    target: { value: testDefaultState.adviceIfTaken }
  });
  fireEvent.change(getByLabelText("Advice if Declined"), {
    target: { value: testDefaultState.adviceIfDeclined }
  });
}

export function checkForClass(
  getByLabelText: (text: string) => HTMLElement,
  cls: "is-valid" | "is-invalid"
) {
  expect(getByLabelText("Name")).toHaveClass(cls);
  expect(getByLabelText("Policy Date")).toHaveClass(cls);
  expect(getByLabelText("Indications")).toHaveClass(cls);
  expect(getByLabelText("Inclusion Criteria")).toHaveClass(cls);
  expect(getByLabelText("Exclusion Criteria")).toHaveClass(cls);
  expect(getByLabelText("Name, Forms and Strengths of Medicine")).toHaveClass(
    cls
  );
  expect(getByLabelText("Route or Method")).toHaveClass(cls);
  expect(getByLabelText("Dosage")).toHaveClass(cls);
  expect(getByLabelText("Side Effects")).toHaveClass(cls);
  expect(getByLabelText("Advice if Taken")).toHaveClass(cls);
  expect(getByLabelText("Advice if Declined")).toHaveClass(cls);
}

export function checkState(
  getByLabelText: (text: string) => HTMLElement,
  hasValue: boolean
) {
  expect(getByLabelText("Name")).toHaveValue(
    hasValue ? testDefaultState.name : ""
  );
  expect(getByLabelText("Policy Date")).toHaveValue(
    hasValue ? testDefaultState.policyDate : ""
  );
  expect(getByLabelText("Indications")).toHaveTextContent(
    hasValue ? testDefaultState.indications : ""
  );
  expect(getByLabelText("Inclusion Criteria")).toHaveTextContent(
    hasValue ? testDefaultState.inclusionCriteria : ""
  );
  expect(getByLabelText("Exclusion Criteria")).toHaveTextContent(
    hasValue ? testDefaultState.exclusionCriteria : ""
  );
  expect(
    getByLabelText("Name, Forms and Strengths of Medicine")
  ).toHaveTextContent(hasValue ? testDefaultState.form : "");
  expect(getByLabelText("Route or Method")).toHaveTextContent(
    hasValue ? testDefaultState.route : ""
  );
  expect(getByLabelText("Dosage")).toHaveTextContent(
    hasValue ? testDefaultState.dose : ""
  );
  expect(getByLabelText("Side Effects")).toHaveTextContent(
    hasValue ? testDefaultState.sideEffects : ""
  );
  expect(getByLabelText("Advice if Taken")).toHaveTextContent(
    hasValue ? testDefaultState.adviceIfTaken : ""
  );
  expect(getByLabelText("Advice if Declined")).toHaveTextContent(
    hasValue ? testDefaultState.adviceIfDeclined : ""
  );
}
