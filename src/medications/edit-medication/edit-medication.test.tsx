import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { EditMedication } from ".";
import {
  authenticatedGet,
  authenticatedPut
} from "../../_testSupport/fetch-helpers";
import {
  checkForClass,
  checkState,
  testDefaultState
} from "../../_testSupport/medication-form-helpers";
import { inDateAdminToken } from "../../_testSupport/tokens";
import { fetcher } from "../../fetcher";
import { history } from "../../history";
import { IMedication } from "../../model/medication";

const editEndpoint = "/api/update-medication";
const getEndpoint = "/api/get-medication";

describe("Edit Medication Page", () => {
  beforeEach(() => {
    fetcher.saveToken(inDateAdminToken);
    history.push = jest.fn();
  });

  afterEach(() => {
    fetcher.clearToken();
    localStorage.clear();
  });

  it("renders without crashing", () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    const div = document.createElement("div");
    ReactDOM.render(<EditMedication id="42" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders loading correctly", () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { container } = render(<EditMedication id="42" />);

    expect(container).toMatchSnapshot();
  });

  it("renders loaded correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);

    const { container } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("defaults to correct values", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);

    const { getByLabelText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    checkState(getByLabelText, true);
  });

  it("declares valid values correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(`${editEndpoint}/42`, inDateAdminToken, testDefaultState, {
      body: JSON.stringify([{ path: "doses", error: "test" }]),
      status: 400
    });

    const { getByLabelText, getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    checkForClass(getByLabelText, "is-valid");
  });

  it("declares server side invalid values correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(`${editEndpoint}/42`, inDateAdminToken, testDefaultState, {
      body: JSON.stringify([
        { path: "adviceIfDeclined", error: "isInvalid" },
        { path: "adviceIfTaken", error: "isBlank" },
        { path: "dose", error: "isInvalid" },
        { path: "exclusionCriteria", error: "isBlank" },
        { path: "form", error: "isInvalid" },
        { path: "inclusionCriteria", error: "isBlank" },
        { path: "indications", error: "isInvalid" },
        { path: "name", error: "isBlank" },
        { path: "policyDate", error: "isBlank" },
        { path: "route", error: "isInvalid" },
        { path: "sideEffects", error: "isBlank" }
      ]),
      status: 400
    });

    const { getByLabelText, getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    checkForClass(getByLabelText, "is-invalid");
  });

  it("declares invalid values correctly", async () => {
    const testInvalidState = {
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
      sideEffects: ""
    };

    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testInvalidState);

    const { getByLabelText, getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    fireEvent.click(getByText("Save"));

    checkForClass(getByLabelText, "is-invalid");
  });

  it("renders server error correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(`${editEndpoint}/42`, inDateAdminToken, testDefaultState, {
      status: 500
    });

    const { getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(
      `${editEndpoint}/42`,
      inDateAdminToken,
      testDefaultState,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    expect(getByText("Save")).toBeDisabled();
  });

  it("reports name already in use error", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(`${editEndpoint}/42`, inDateAdminToken, testDefaultState, {
      body: JSON.stringify([{ path: "name", error: "isInUse" }]),
      status: 400
    });

    const { getByLabelText, getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Name")).toHaveClass("is-invalid");
  });

  it("redirects on successful form submit", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedPut(`${editEndpoint}/42`, inDateAdminToken, testDefaultState, {
      id: 10
    });

    const { getByText } = render(<EditMedication id="42" />);

    await wait(() => expect(fetchMock.done(`${getEndpoint}/42`)).toBeTruthy());

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/medication/10?reload=true");

    const cachedString = localStorage.getItem("medications");

    expect(cachedString).not.toBeNull();

    const cachedData = JSON.parse(cachedString as string) as Array<
      Partial<IMedication>
    >;

    const cachedItem = cachedData.find(m => m.id === 10);

    expect(cachedItem).toBeDefined();
    expect(cachedItem).toEqual({ id: 10, ...testDefaultState });
  });
});
