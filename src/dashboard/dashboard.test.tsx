import { fireEvent, render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Dashboard } from ".";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { logout } from "../ms-login";
import { fetcher } from "../fetcher";

jest.mock("../hooks/useOnlineStatus");
jest.mock("../ms-login");

describe("Dashboard Page", () => {
  beforeEach(() => {
    fetcher.getName = jest.fn().mockReturnValue("Test User");
    history.push = jest.fn();
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

  it("triggers the logout process if sign out is clicked", () => {
    const { getByText } = render(<Dashboard />);

    fireEvent.click(getByText("Sign Out"));

    expect(logout).toBeCalled();
  });
});
