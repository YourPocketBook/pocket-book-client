import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { ForgotPasswordDone } from ".";

describe("Forgot Password Done Page", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<ForgotPasswordDone />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<ForgotPasswordDone />);

    expect(container).toMatchSnapshot();
  });
});
