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
import { ForgotPassword } from ".";
import "../_testSupport/fetch-helpers";
import { history } from "../history";

const endpoint = "/api/forgot-password";

const testDefaultState = {
  email: "test@sja.org.uk"
};

describe("Forgot Password Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ForgotPassword />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("defaults to correct values", () => {
    const { getByLabelText } = render(<ForgotPassword />);

    expect(getByLabelText("Email")).toHaveAttribute("value", "");
  });

  it("renders valid values correctly", async () => {
    fetchMock.post(endpoint, {
      body: JSON.stringify([{ path: "doses", error: "test" }]),
      status: 400
    });

    const { container, getByLabelText, getByText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });

    fireEvent.click(getByText("Submit"));

    await waitForDomChange({ container });

    expect(getByLabelText("Email")).toHaveClass("is-valid");
  });

  it("renders invalid values correctly", () => {
    const { getByLabelText, getByText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "" }
    });

    fireEvent.click(getByText("Submit"));

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
  });

  it("declares non-SJA email invalid", () => {
    const { getByLabelText, getByText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test@gmail.com" }
    });

    fireEvent.click(getByText("Submit"));

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
  });

  it("renders server error correctly", async () => {
    fetchMock.post(endpoint, { status: 500 });

    const { getByText, getByLabelText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.click(getByText("Submit"));

    await waitForElement(() => getByText(/The server has had an issue/));

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", () => {
    // tslint:disable-next-line: no-empty
    fetchMock.post(endpoint, new Promise(() => {}));

    const { getByLabelText, getByText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });

    fireEvent.click(getByText("Submit"));

    expect(getByText("Submit")).toBeDisabled();
  });

  it("redirects on successful form submit", async () => {
    fetchMock.post(endpoint, {
      status: 204
    });

    const { getByLabelText, getByText } = render(<ForgotPassword />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });

    fireEvent.click(getByText("Submit"));

    await wait(() => expect(history.push).toBeCalled());

    expect(history.push).toBeCalledWith("/forgot-password-done");
  });
});
