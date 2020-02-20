import "@testing-library/jest-dom/extend-expect";
import { render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { Medications } from ".";
import { authenticatedGet } from "../_testSupport/fetch-helpers";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

const getEndpoint = "/api/get-medications";

describe("Medications Home", () => {
  beforeAll(() => {
    fetcher.saveToken(inDateNonAdminToken);
  });

  beforeEach(() => {
    history.push = jest.fn();
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    localStorage.removeItem("medications");
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Medications />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders cached results correctly", () => {
    authenticatedGet(
      getEndpoint,
      inDateNonAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    localStorage.setItem(
      "medications",
      JSON.stringify([
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2" }
      ])
    );

    const { container } = render(<Medications />);

    expect(container).toMatchSnapshot();
  });

  it("updates cached results correctly", async () => {
    authenticatedGet(getEndpoint, inDateNonAdminToken, [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2A" },
      { id: 3, name: "Test 3" }
    ]);

    localStorage.setItem(
      "medications",
      JSON.stringify([
        { id: 1, name: "Test 1" },
        { id: 2, name: "Test 2", inclusionCriteria: "Test Inclusion" }
      ])
    );

    render(<Medications />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(JSON.parse(localStorage.getItem("medications") || "")).toEqual([
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2A", inclusionCriteria: "Test Inclusion" },
      { id: 3, name: "Test 3" }
    ]);
  });

  it("renders results correctly", async () => {
    authenticatedGet(getEndpoint, inDateNonAdminToken, [
      { id: 1, name: "Test 1" },
      { id: 2, name: "Test 2" }
    ]);

    const { container } = render(<Medications />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders loaded correctly when offline", () => {
    localStorage.setItem(
      "medications",
      JSON.stringify([
        { id: 1, name: "Test 1" },
        {
          adviceIfDeclined: "Test Advice 1",
          adviceIfTaken: "Test Advice 2",
          dose: "Test Dose",
          exclusionCriteria: "Test Exclusion",
          form: "Test Form",
          id: 2,
          inclusionCriteria: "Test Inclusion",
          indications: "Test Indications",
          name: "Test 2",
          route: "Test Route",
          sideEffects: "Test Side Effects"
        }
      ])
    );
    (useOnlineStatus as jest.Mock).mockReset();
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    const { getByText } = render(<Medications />);

    expect(getByText("test 1")).toHaveClass("disabled");
    expect(getByText("test 2")).not.toHaveClass("disabled");
  });

  it("renders loading correctly", () => {
    authenticatedGet(
      getEndpoint,
      inDateNonAdminToken,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { container } = render(<Medications />);

    expect(container).toMatchSnapshot();
  });

  it("renders no medications correctly", async () => {
    authenticatedGet(getEndpoint, inDateNonAdminToken, []);

    const { container } = render(<Medications />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders failed to load correctly", async () => {
    authenticatedGet(getEndpoint, inDateNonAdminToken, { status: 500 });

    const { container } = render(<Medications />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("renders failed to load correctly when fetch throws", async () => {
    authenticatedGet(getEndpoint, inDateNonAdminToken, { throws: new Error() });

    const { container } = render(<Medications />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });
});
