import "@testing-library/jest-dom/extend-expect";
import {
  fireEvent,
  render,
  wait,
  waitForDomChange,
  waitForElement
} from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { Medication } from ".";
import {
  authenticatedDelete,
  authenticatedGet
} from "../../_testSupport/fetch-helpers";
import {
  inDateAdminToken,
  inDateNonAdminToken
} from "../../_testSupport/tokens";
import { fetcher } from "../../fetcher";
import { history } from "../../history";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { IMedication } from "../../model/medication";

jest.mock("../../hooks/useOnlineStatus");

const getEndpoint = "/api/get-medication";
const deleteEndPoint = "/api/delete-medication";

const testDefaultState = {
  adviceIfDeclined: "Test Advice 1",
  adviceIfTaken: "Test Advice 2",
  dose: "Test Dose",
  exclusionCriteria: "Test Exclusion",
  form: "Test Form",
  id: 42,
  inclusionCriteria: "Test Inclusion",
  indications: "Test Indications",
  name: "Test Name",
  policyDate: "2018-09-10",
  route: "Test Route",
  sideEffects: "Test Side Effects"
};

describe("Medication Detail Page", () => {
  beforeEach(() => {
    fetcher.saveToken(inDateNonAdminToken);
    history.push = jest.fn();
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    localStorage.clear();
    fetcher.clearToken();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Medication id="42" reload={false} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders cached results correctly", async () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateNonAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    localStorage.setItem("medications", JSON.stringify([testDefaultState]));

    const { container } = render(<Medication id="42" reload={false} />);

    expect(container).toMatchSnapshot();
  });

  it("renders partial cached results correctly", async () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateNonAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const testMedication: Array<Partial<IMedication>> = [
      {
        id: 42,
        name: "Test Name"
      }
    ];

    localStorage.setItem("medications", JSON.stringify(testMedication));

    const { container } = render(<Medication id="42" reload={false} />);

    expect(container).toMatchSnapshot();
  });

  it("updates cached results correctly", async () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateNonAdminToken,
      testDefaultState
    );

    const testMedication: Array<Partial<IMedication>> = [
      {
        id: 42,
        name: "Test Name"
      },
      { id: 43, name: "Test Name 2" }
    ];

    localStorage.setItem("medications", JSON.stringify(testMedication));

    render(<Medication id="42" reload={true} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(JSON.parse(localStorage.getItem("medications") || "")).toEqual([
      testDefaultState,
      { id: 43, name: "Test Name 2" }
    ]);
  });

  it("renders results correctly", async () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateNonAdminToken,
      testDefaultState
    );

    const { container } = render(<Medication id="42" reload={false} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders no policy date result correctly", async () => {
    const noDateResult = { ...testDefaultState, policyDate: null };

    authenticatedGet(`${getEndpoint}/42`, inDateNonAdminToken, noDateResult);

    const { container } = render(<Medication id="42" reload={false} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders results correctly for administrator", async () => {
    fetcher.saveToken(inDateAdminToken);
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);

    const { getByText } = render(<Medication id="42" reload={false} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Edit Medication")).toBeInTheDocument();
    expect(getByText("Delete Medication")).toBeInTheDocument();
  });

  it("renders results correctly for administrator when offline", async () => {
    fetcher.saveToken(inDateAdminToken);
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    localStorage.setItem("medications", JSON.stringify([testDefaultState]));

    const { getByText } = render(<Medication id="42" reload={false} />);

    expect(getByText("Edit Medication")).toHaveClass("disabled");
    expect(getByText("Delete Medication")).toHaveClass("disabled");
  });

  it("makes request to delete medication correctly", async () => {
    fetcher.saveToken(inDateAdminToken);
    authenticatedGet(`${getEndpoint}/42`, inDateAdminToken, testDefaultState);
    authenticatedDelete(`${deleteEndPoint}/42`, inDateAdminToken, {
      status: 204
    });

    const { getByText, container } = render(
      <Medication id="42" reload={false} />
    );

    await waitForDomChange({ container });

    fireEvent.click(getByText("Delete Medication"));

    await waitForElement(() => getByText("Are you sure?"));

    fireEvent.click(getByText("Yes"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/medications");
  });

  it("renders loading correctly", async () => {
    authenticatedGet(
      `${getEndpoint}/42`,
      inDateNonAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { container } = render(<Medication id="42" reload={false} />);

    expect(container).toMatchSnapshot();
  });

  it("renders failed to load correctly", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateNonAdminToken, { status: 500 });

    const { container } = render(<Medication id="42" reload={false} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders failed to load correctly when fetch throws", async () => {
    authenticatedGet(`${getEndpoint}/42`, inDateNonAdminToken, {
      throws: new Error()
    });

    const { container } = render(<Medication id="42" reload={false} />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });
});
