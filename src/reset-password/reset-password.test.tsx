import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import deepEqual from "deep-equal";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { ResetPassword } from ".";
import "../_testSupport/fetch-helpers";
import { history } from "../history";

jest.mock("zxcvbn");

const endpoint = "/api/reset-password";

const testDefaultState = {
  password: "testPassword"
};

describe("Reset Password Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
    history.replace = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ResetPassword userId="1234" code="4567" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<ResetPassword userId="1234" code="4567" />);

    expect(container).toMatchSnapshot();
  });

  it("defaults to correct values", () => {
    const { getByLabelText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    expect(getByLabelText("New Password")).toHaveAttribute("value", "");
    expect(getByLabelText("New Password")).toHaveAttribute("type", "password");
  });

  it("flags valid values correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), {
          code: "4567",
          newPassword: testDefaultState.password,
          userId: "1234"
        }),
      {
        body: JSON.stringify([{ path: "doses", error: "test" }]),
        status: 400
      }
    );

    const { getByLabelText, getByText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(getByText("Submit"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("New Password")).toHaveClass("is-valid");
  });

  it("flags invalid values correctly", () => {
    const { getByLabelText, getByText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "" }
    });
    fireEvent.click(getByText("Submit"));

    expect(getByLabelText("New Password")).toHaveClass("is-invalid");
  });

  it("renders server error correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), {
          code: "4567",
          newPassword: testDefaultState.password,
          userId: "1234"
        }),
      {
        status: 500
      }
    );

    const { getByLabelText, getByText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(getByText("Submit"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), {
          code: "4567",
          newPassword: testDefaultState.password,
          userId: "1234"
        }),
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { getByLabelText, getByText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(getByText("Submit"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Submit")).toBeDisabled();
  });

  it("toggles show password when button is clicked", () => {
    const { getByText, getByLabelText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.click(getByText("Show Password"));
    expect(getByLabelText("New Password")).toHaveAttribute("type", "text");

    fireEvent.click(getByText("Hide Password"));
    expect(getByLabelText("New Password")).toHaveAttribute("type", "password");
  });

  it("redirects on successful form submit", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), {
          code: "4567",
          newPassword: testDefaultState.password,
          userId: "1234"
        }),
      { status: 204 }
    );

    const { getByLabelText, getByText } = render(
      <ResetPassword userId="1234" code="4567" />
    );

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(getByText("Submit"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/login");
  });

  it("redirects home when no userId", async () => {
    render(<ResetPassword userId="" code="4567" />);

    expect(history.replace).toBeCalledWith("/");
  });

  it("redirects home when no code", async () => {
    render(<ResetPassword userId="1234" code="" />);

    expect(history.replace).toBeCalledWith("/");
  });
});
