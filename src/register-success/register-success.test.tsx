import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { RegisterSuccess } from ".";

describe("Home Page", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<RegisterSuccess />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<RegisterSuccess />);

    expect(container).toMatchSnapshot();
  });
});
