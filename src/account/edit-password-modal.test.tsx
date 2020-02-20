import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { authenticatedPut } from "../_testSupport/fetch-helpers";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { EditPasswordModal } from "./edit-password-modal";

const setPasswordEndPoint = "/api/update-password";

describe("Edit Password Modal", () => {
  beforeAll(() => {
    fetcher.saveToken(inDateNonAdminToken);
  });

  beforeEach(() => {
    history.push = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders hidden correctly", () => {
    const { baseElement } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={false} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("renders shown correctly", async () => {
    const { baseElement } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("hides dialog when cancel button is pressed", () => {
    const showFn = jest.fn();

    const { getByText } = render(
      <EditPasswordModal done={jest.fn()} setShow={showFn} show={true} />
    );

    fireEvent.click(getByText("Cancel"));

    expect(showFn).toBeCalledWith(false);
  });

  it("defaults to correct values", async () => {
    const { getByLabelText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    expect(getByLabelText("Current Password")).toHaveAttribute("value", "");
    expect(getByLabelText("New Password")).toHaveAttribute("value", "");
  });

  it("declares valid values correctly", async () => {
    const testCurrent = "Test Current";
    const testNew = "Test New";

    authenticatedPut(
      setPasswordEndPoint,
      inDateNonAdminToken,
      { currentPassword: testCurrent, newPassword: testNew },
      { status: 400, body: JSON.stringify([{ path: "doses", error: "test" }]) }
    );

    const { getByLabelText, getByText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: testCurrent }
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testNew }
    });

    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Current Password")).toHaveClass("is-valid");
    expect(getByLabelText("New Password")).toHaveClass("is-valid");
  });

  it("declares invalid values correctly", () => {
    const { getByLabelText, getByText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Save"));

    expect(getByLabelText("Current Password")).toHaveClass("is-invalid");
    expect(getByLabelText("New Password")).toHaveClass("is-invalid");
  });

  it("renders server error correctly", async () => {
    const testCurrent = "Test Current";
    const testNew = "Test New";

    authenticatedPut(
      setPasswordEndPoint,
      inDateNonAdminToken,
      { currentPassword: testCurrent, newPassword: testNew },
      { status: 500 }
    );

    const { getByLabelText, getByText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: testCurrent }
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testNew }
    });
    fireEvent.click(getByText("Save"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", () => {
    const testCurrent = "Test Current";
    const testNew = "Test New";

    authenticatedPut(
      setPasswordEndPoint,
      inDateNonAdminToken,
      { currentPassword: testCurrent, newPassword: testNew },
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { getByText, getByLabelText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: testCurrent }
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testNew }
    });

    fireEvent.click(getByText("Save"));
    expect(getByText("Save")).toBeDisabled();
  });

  it("calls done on successful form submit", async () => {
    const testFn = jest.fn();
    const testCurrent = "Test Current";
    const testNew = "Test New";

    authenticatedPut(
      setPasswordEndPoint,
      inDateNonAdminToken,
      { currentPassword: testCurrent, newPassword: testNew },
      { status: 204 }
    );

    const { getByText, getByLabelText } = render(
      <EditPasswordModal done={testFn} setShow={jest.fn()} show={true} />
    );

    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: testCurrent }
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testNew }
    });
    fireEvent.click(getByText("Save"));
    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(testFn).toBeCalled();
  });

  it("toggles show password when button is clicked", () => {
    const { getByText, getByLabelText } = render(
      <EditPasswordModal done={jest.fn()} setShow={jest.fn()} show={true} />
    );

    fireEvent.click(getByText("Show Password"));
    expect(getByLabelText("Current Password")).toHaveAttribute("type", "text");
    expect(getByLabelText("New Password")).toHaveAttribute("type", "text");

    fireEvent.click(getByText("Hide Password"));
    expect(getByLabelText("Current Password")).toHaveAttribute(
      "type",
      "password"
    );
    expect(getByLabelText("New Password")).toHaveAttribute("type", "password");
  });
});
