import { fireEvent, render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Dashboard } from ".";
import { inDateAdminToken, inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

describe("Dashboard Page", () => {
  beforeEach(() => {
    history.push = jest.fn();
    fetcher.saveToken(inDateNonAdminToken);
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(<Dashboard />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly when online", () => {
    const { container } = render(<Dashboard />);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly when offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    const { container } = render(<Dashboard />);

    expect(container).toMatchSnapshot();
  });

  it("hides admin button if user is not an administrator", () => {
    const { getByText } = render(<Dashboard />);

    expect(() => getByText("Administration")).toThrowError();
  });

  it("shows admin button if user is an administrator", () => {
    fetcher.saveToken(inDateAdminToken);

    const { getByText } = render(<Dashboard />);

    expect(() => getByText("Administration")).not.toThrowError();
  });

  it("clears the token and redirects to the home page if sign out is clicked", () => {
    const { getByText } = render(<Dashboard />);

    fireEvent.click(getByText("Sign Out"));

    expect(fetcher.hasToken()).toBeFalsy();
    expect(history.push).toHaveBeenCalledWith("/");
  });
});
