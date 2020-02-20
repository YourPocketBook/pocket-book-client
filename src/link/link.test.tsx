import { fireEvent, render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { Link } from ".";
import { history } from "../history";

describe("Home Page", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Link href="/test">Test</Link>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<Link href="/test">Test</Link>);

    expect(container).toMatchSnapshot();
  });

  it("pushes to history when clicked", () => {
    history.push = jest.fn();

    const target = {
      pathname: "/test",
      search: "?testid=42"
    };

    const { getByText } = render(<Link href="/test?testid=42">Test</Link>);
    fireEvent.click(getByText("Test"), {
      target
    });

    expect(history.push).toHaveBeenCalledWith(target);
  });
});
