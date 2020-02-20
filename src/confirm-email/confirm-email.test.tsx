import "@testing-library/jest-dom/extend-expect";
import { render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { ConfirmEmail } from ".";
import "../_testSupport/fetch-helpers";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

const testUserId = "TestUser";
const testCode = "123456";
const endpoint = "/api/confirm-user";

describe("Confirm Email", () => {
  beforeEach(() => {
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ConfirmEmail userId={testUserId} code={testCode} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("displays initial state correctly", async () => {
    fetchMock.post(
      `${endpoint}?userId=${testUserId}&code=${testCode}`,
      // tslint:disable-next-line: no-empty
      new Promise(() => {})
    );

    const { container } = render(
      <ConfirmEmail userId={testUserId} code={testCode} />
    );

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("displays confirmation after calling the API and succeeding", async () => {
    fetchMock.post(`${endpoint}?userId=${testUserId}&code=${testCode}`, {
      status: 204
    });

    const { container } = render(
      <ConfirmEmail userId={testUserId} code={testCode} />
    );

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("displays error after calling the API and failing", async () => {
    fetchMock.post(`${endpoint}?userId=${testUserId}&code=${testCode}`, {
      body: {
        error: "isInvalid",
        path: "code"
      },
      status: 400
    });

    const { container } = render(
      <ConfirmEmail userId={testUserId} code={testCode} />
    );

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("displays error after calling the API when offline", async () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    const { container } = render(
      <ConfirmEmail userId={testUserId} code={testCode} />
    );

    expect(container).toMatchSnapshot();
  });
});
