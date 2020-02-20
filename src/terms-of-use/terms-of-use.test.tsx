import { render } from "@testing-library/react";
import React from "react";
import ReactDOM from "react-dom";
import { TermsOfUse } from ".";

describe("Terms Of Use Page", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<TermsOfUse />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", () => {
    const { container } = render(<TermsOfUse />);

    expect(container).toMatchSnapshot();
  });
});
