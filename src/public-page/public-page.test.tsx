import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { PublicPage } from ".";
import { expiredToken, inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";

describe("Public Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
    fetcher.clearToken();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it("does not redirect if no token is present", () => {
    const { container } = render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).not.toBeCalled();
    expect(container).toMatchSnapshot();
  });

  it("does not redirect if token has expired", () => {
    fetcher.saveToken(expiredToken);

    render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).not.toBeCalled();
    expect(fetcher.hasToken()).toBeFalsy();
  });

  it("redirects to home if token is in-date", async () => {
    fetcher.saveToken(inDateNonAdminToken);

    render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).toBeCalledWith("/home");
  });
});
