import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { PublicPage } from ".";
import { fetcher } from "../fetcher";
import { history } from "../history";

describe("Public Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
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
    fetcher.hasToken = jest.fn().mockReturnValue(false);

    const { container } = render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).not.toBeCalled();
    expect(container).toMatchSnapshot();
  });

  it("does not redirect if token has expired", () => {
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(false);

    render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).not.toBeCalled();
  });

  it("redirects to home if token is in-date", async () => {
    fetcher.hasToken = jest.fn().mockReturnValue(true);
    fetcher.isInDate = jest.fn().mockReturnValue(true);

    render(
      <PublicPage>
        <div>Test</div>
      </PublicPage>
    );

    expect(history.push).toBeCalledWith("/home");
  });
});
