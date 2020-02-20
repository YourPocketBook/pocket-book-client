import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, wait } from "@testing-library/react";
import deepEqual from "deep-equal";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { Register } from ".";
import "../_testSupport/fetch-helpers";
import { history } from "../history";

jest.mock("zxcvbn");

const endpoint = "/api/register-user";

const testDefaultState = {
  email: "test@sja.org.uk",
  name: "Test Name",
  password: "testPassword",
  updateEmailConsentGiven: true
};

describe("Register Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Register />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<Register />);

    expect(container).toMatchSnapshot();
  });

  it("defaults to correct values", () => {
    const { getByLabelText } = render(<Register />);

    expect(getByLabelText("Name")).toHaveAttribute("value", "");
    expect(getByLabelText("Email")).toHaveAttribute("value", "");
    expect(getByLabelText("Password")).toHaveAttribute("value", "");
    expect(getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("renders valid values correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), testDefaultState),
      {
        body: JSON.stringify([{ path: "doses", error: "test" }]),
        status: 400
      }
    );

    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Name"), {
      target: { value: testDefaultState.name }
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("Terms", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("consent", { exact: false, selector: "input" })
    );
    fireEvent.click(getByText("Register", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Name")).toHaveClass("is-valid");
    expect(getByLabelText("Email")).toHaveClass("is-valid");
    expect(getByLabelText("Password")).toHaveClass("is-valid");
  });

  it("renders invalid values correctly", () => {
    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.click(getByText("Register", { selector: "button" }));

    expect(getByLabelText("Name")).toHaveClass("is-invalid");
    expect(getByLabelText("Email")).toHaveClass("is-invalid");
    expect(getByLabelText("Password")).toHaveClass("is-invalid");
    expect(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    ).toHaveClass("is-invalid");
    expect(
      getByLabelText("Terms", { exact: false, selector: "input" })
    ).toHaveClass("is-invalid");
  });

  it("renders duplicate email correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), testDefaultState),
      {
        body: JSON.stringify([{ path: "email", error: "isInUse" }]),
        status: 400
      }
    );

    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Name"), {
      target: { value: testDefaultState.name }
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("Terms", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("consent", { exact: false, selector: "input" })
    );
    fireEvent.click(getByText("Register", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
    expect(getByText(/email is already in use/)).toBeDefined();
  });

  it("declares non-SJA email invalid", () => {
    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Email"), {
      target: { value: "test@gmail.com" }
    });

    fireEvent.click(getByText("Register", { selector: "button" }));

    expect(getByLabelText("Name")).toHaveClass("is-invalid");
    expect(getByLabelText("Email")).toHaveClass("is-invalid");
    expect(getByLabelText("Password")).toHaveClass("is-invalid");
    expect(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    ).toHaveClass("is-invalid");
    expect(
      getByLabelText("Terms", { exact: false, selector: "input" })
    ).toHaveClass("is-invalid");

    expect(getByLabelText("Email")).toHaveClass("is-invalid");
    expect(getByText(/give your SJA email/)).toBeDefined();
  });

  it("renders server error correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), testDefaultState),
      {
        status: 500
      }
    );

    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Name"), {
      target: { value: testDefaultState.name }
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("Terms", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("consent", { exact: false, selector: "input" })
    );
    fireEvent.click(getByText("Register", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText(/The server has had an issue/)).toBeInTheDocument();
  });

  it("renders in progress correctly", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), testDefaultState),
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Name"), {
      target: { value: testDefaultState.name }
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("Terms", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("consent", { exact: false, selector: "input" })
    );
    fireEvent.click(getByText("Register", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Register", { selector: "button" })).toBeDisabled();
  });

  it("toggles show password when button is clicked", () => {
    const { getByText, getByLabelText } = render(<Register />);

    fireEvent.click(getByText("Show Password"));
    expect(getByLabelText("Password")).toHaveAttribute("type", "text");

    fireEvent.click(getByText("Hide Password"));
    expect(getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("redirects on successful form submit", async () => {
    fetchMock.post(
      (u, h) =>
        u === endpoint &&
        deepEqual(JSON.parse((h.body as string) || ""), testDefaultState),
      {
        status: 204
      }
    );

    const { getByLabelText, getByText } = render(<Register />);

    fireEvent.change(getByLabelText("Name"), {
      target: { value: testDefaultState.name }
    });
    fireEvent.change(getByLabelText("Email"), {
      target: { value: testDefaultState.email }
    });
    fireEvent.change(getByLabelText("Password"), {
      target: { value: testDefaultState.password }
    });
    fireEvent.click(
      getByLabelText("Privacy Policy", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("Terms", { exact: false, selector: "input" })
    );
    fireEvent.click(
      getByLabelText("consent", { exact: false, selector: "input" })
    );
    fireEvent.click(getByText("Register", { selector: "button" }));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/register-success");
  });
});
