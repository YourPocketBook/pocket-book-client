import { render } from "@testing-library/react";
import React from "react";
import { HideOnError } from ".";

function TestControl({ fail }: { fail: boolean }) {
  if (fail) {
    throw Error();
  }
  return <div className="test" />;
}

describe("Hide On Error", () => {
  it("shows a successful control", () => {
    const { container } = render(
      <HideOnError>
        <TestControl fail={false} />
      </HideOnError>
    );

    expect(container).toMatchSnapshot();
  });

  it("hides a failing control", () => {
    const { container } = render(
      <HideOnError>
        <TestControl fail={true} />
      </HideOnError>
    );

    expect(container).toMatchSnapshot();
  });
});
