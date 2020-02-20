import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { PrivatePage } from ".";
import { expiredToken, inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

describe("Private Page", () => {
  beforeEach(() => {
    fetcher.clearToken();
    history.push = jest.fn();
    (useOnlineStatus as jest.Mock).mockReset();
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
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

    expect(history.push).toBeCalledWith("/login");
  });

  it("redirects to the login page if no token is present when offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(history.push).toBeCalledWith("/login");
  });

  it("redirects to the login page if token has expired and user is online", () => {
    fetcher.saveToken(expiredToken);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(history.push).toBeCalledWith("/login");
    expect(fetcher.hasToken()).toBeFalsy();
  });

  it("does not redirect to the login page if token has expired and user is offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    fetcher.saveToken(expiredToken);

    render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(history.push).not.toBeCalledWith("/login");
    expect(fetcher.checkToken(expiredToken)).toBeTruthy();
  });

  it("passes real name to content if token is in-date when online", async () => {
    fetcher.saveToken(inDateNonAdminToken);

    const { container } = render(
      <PrivatePage>
        <div>Test</div>
      </PrivatePage>
    );

    expect(container).toMatchSnapshot();
    expect(history.push).not.toBeCalled();
  });

  it("renders SJA copyright correctly", async () => {
    fetcher.saveToken(inDateNonAdminToken);

    const { container } = render(
      <PrivatePage contentDate="2018">
        <div>Test</div>
      </PrivatePage>
    );

    expect(container).toMatchSnapshot();
    expect(history.push).not.toBeCalled();
  });
});
