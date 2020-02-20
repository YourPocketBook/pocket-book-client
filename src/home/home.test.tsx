import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Home } from ".";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

describe("Home Page", () => {
  beforeEach(() => {
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Home />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<Home />);

    expect(container).toMatchSnapshot();
  });

  it("renders correctly when offline", () => {
    (useOnlineStatus as jest.Mock).mockReturnValue(false);

    const { container } = render(<Home />);

    expect(container).toMatchSnapshot();
  });
});
