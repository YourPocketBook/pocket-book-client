import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { authenticatedPut } from "../_testSupport/fetch-helpers";
import { inDateAdminToken, inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { EditNameModal } from "./edit-name-modal";

const setNameEndPoint = "/api/update-name";

describe("Edit Name Modal", () => {
  beforeEach(() => {
    fetcher.saveToken(inDateNonAdminToken);
    history.push = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <EditNameModal initialName="Test Name" setShow={jest.fn()} show={true} />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders hidden correctly", () => {
    const { baseElement } = render(
      <EditNameModal initialName="Test Name" setShow={jest.fn()} show={false} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("renders shown correctly", async () => {
    const { baseElement } = render(
      <EditNameModal initialName="Test Name" setShow={jest.fn()} show={true} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("hides dialog when cancel button is pressed", () => {
    const showFn = jest.fn();

    const { getByText } = render(
      <EditNameModal initialName="Test Name" setShow={showFn} show={true} />
    );

    fireEvent.click(getByText("Cancel"));

    expect(showFn).toBeCalledWith(false);
  });

  it("defaults to correct values", async () => {
    const testName = "Test Name";

    const { getByLabelText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    expect(getByLabelText("Name")).toHaveAttribute("value", testName);
  });

  it("declares valid values correctly", async () => {
    const testName = "Test Name";

    authenticatedPut(
      setNameEndPoint,
      inDateNonAdminToken,
      { name: testName },
      { status: 400, body: JSON.stringify([{ path: "doses", error: "test" }]) }
    );

    const { getByLabelText, getByText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Name")).toHaveClass("is-valid");
  });

  it("declares invalid values correctly", () => {
    const testName = "";

    const { getByLabelText, getByText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByLabelText("Name")).toHaveClass("is-invalid");
  });

  it("renders server error correctly", async () => {
    const testName = "Test Name";

    authenticatedPut(
      setNameEndPoint,
      inDateNonAdminToken,
      { name: testName },
      { status: 500 }
    );

    const { getByText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", () => {
    const testName = "Test Name";

    authenticatedPut(
      setNameEndPoint,
      inDateNonAdminToken,
      { name: testName },
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { getByText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByText("Save")).toBeDisabled();
  });

  it("updates page on successful form submit", async () => {
    const testName = "Test Name";

    authenticatedPut(
      setNameEndPoint,
      inDateNonAdminToken,
      { name: testName },
      { token: inDateAdminToken }
    );

    const { getByText } = render(
      <EditNameModal initialName={testName} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(fetcher.getName()).toBe(testName);
  });
});
