import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { PrivatePage } from ".";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { login } from "../ms-login";

jest.mock("../ms-login");
jest.mock("../fetcher");
jest.mock("../hooks/useOnlineStatus");

describe("Private Page", () => {
  beforeEach(() => {
    fetcher.getName = jest.fn().mockReturnValue("Test User");
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });
  afterEach(() => {
    (login as jest.Mock).mockClear();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("redirects to the login page if no token is present when online", () => {
    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(login).toBeCalled();
  });

  it("redirects to the login page if no token is present when offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(login).toBeCalled();
  });

  it("redirects to the login page if token has expired and user is online", () => {
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(false);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(login).toBeCalled();
  });

  it("does not redirect to the login page if token has expired and user is offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(false);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(login).not.toBeCalledWith();
  });

  it("passes real name to content if token is in-date when online", async () => {
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(true);

    const { container } = render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders SJA copyright correctly", async () => {
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(true);

    const { container } = render(
      <PrivatePage contentDate="2018">
        <div>Test</div>
      </PrivatePage>
    );

    expect(container).toMatchSnapshot();
    expect(login).not.toBeCalledWith();
  });
});
