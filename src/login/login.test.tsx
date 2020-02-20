import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { Login } from ".";
import "../_testSupport/fetch-helpers";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";

const endpoint = "/api/login";

describe("Login Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
  });

  afterEach(() => {
    fetcher.clearToken();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Login />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders default correctly", () => {
    const { container } = render(<Login />);

    expect(container).toMatchSnapshot();
  });

  it("defaults to correct values", () => {
    const { getByLabelText } = render(<Login />);

    expect(getByLabelText("Email")).toHaveAttribute("value", "");
    expect(getByLabelText("Password")).toHaveAttribute("value", "");
  });

  it("declares valid values correctly", async () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      {
        body: JSON.stringify([{ path: "doses", error: "test" }]),
        status: 400
      }
    );

    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });

    fireEvent.click(getByText("Login", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Email")).toHaveClass("is-valid");
    expect(getByLabelText("Password")).toHaveClass("is-valid");
  });

  it("declares invalid values correctly", () => {
    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test-value" }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: "" }
    });

    fireEvent.click(getByText("Login", { selector: "button" }));

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
    expect(getByLabelText("Password")).toHaveClass("is-invalid");
  });

  it("declares non-sja email invalid correctly", () => {
    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test@gmail.com" }
    });

    fireEvent.click(getByText("Login", { selector: "button" }));

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
  });

  it("renders server error correctly", async () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      { status: 500 }
    );

    const { getByText, getByLabelText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });
    fireEvent.click(getByText("Login", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );
    const { getByText, getByLabelText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });
    fireEvent.click(getByText("Login", { selector: "button" }));

    expect(getByText("Login", { selector: "button" })).toBeDisabled();
  });

  it("renders not authorised correctly", async () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      { status: 401 }
    );

    const { getByText, getByLabelText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });
    fireEvent.click(getByText("Login", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(
      getByText(/That username and password was not recognised/)
    ).toBeInTheDocument();
  });

  it("renders not confirmed correctly", async () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      {
        body: JSON.stringify([{ error: "emailNotConfirmed", path: "email" }]),
        status: 400
      }
    );

    const { getByText, getByLabelText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });
    fireEvent.click(getByText("Login", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/Your email hasn't been confirmed/)).toBeInTheDocument();
  });

  it("toggles show password when button is clicked", () => {
    const { getByText, getByLabelText } = render(<Login />);

    fireEvent.click(getByText("Show Password"));
    expect(getByLabelText("Password")).toHaveAttribute("type", "text");

    fireEvent.click(getByText("Hide Password"));
    expect(getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("redirects on successful form submit", async () => {
    const testEmail = "test@sja.org.uk";
    const testPassword = "testPassword";

    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        h.body === JSON.stringify({ email: testEmail, password: testPassword }),
      {
        body: JSON.stringify({ token: inDateNonAdminToken }),
        status: 200
      }
    );

    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: testEmail }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testPassword }
    });
    fireEvent.click(getByText("Login", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/home");
    expect(fetcher.checkToken(inDateNonAdminToken)).toBeTruthy();
  });
});
