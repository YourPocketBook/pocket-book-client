import { fireEvent, render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Dashboard } from ".";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { logout } from "../ms-login";

jest.mock("../hooks/useOnlineStatus");
jest.mock("../ms-login");

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

  it("triggers the logout process if sign out is clicked", () => {
    const { getByText } = render(<Dashboard />);

    fireEvent.click(getByText("Sign Out"));

    expect(logout).toBeCalled();
  });
});
