import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { LoginError } from ".";

describe("Forgot Password Done Page", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<LoginError />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<LoginError />);

    expect(container).toMatchSnapshot();
  });
});
