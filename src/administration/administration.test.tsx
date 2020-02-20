import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Administration } from ".";
import { inDateAdminToken, inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";

describe("Administration Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
    fetcher.clearToken();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(<Administration />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("redirects non-admin users back to the home page", () => {
    fetcher.saveToken(inDateNonAdminToken);

    render(<Administration />);

    expect(history.push).toBeCalledWith("/home");
  });

  it("does not redirect admin users back to the home page", () => {
    fetcher.saveToken(inDateAdminToken);

    const { container } = render(<Administration />);

    expect(history.push).not.toBeCalled();
    expect(container).toMatchSnapshot();
  });
});
