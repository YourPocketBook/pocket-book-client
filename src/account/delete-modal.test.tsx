import { fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { authenticatedDelete } from "../_testSupport/fetch-helpers";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { DeleteModal } from "./delete-modal";

const deleteEndPoint = "/api/delete-account";

describe("Delete User Modal", () => {
  beforeEach(() => {
    fetcher.saveToken(inDateNonAdminToken);
    history.push = jest.fn();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(<DeleteModal setShow={jest.fn()} show={true} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders hidden correctly", () => {
    const { baseElement } = render(
      <DeleteModal setShow={jest.fn()} show={false} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("renders shown correctly", async () => {
    const { baseElement } = render(
      <DeleteModal setShow={jest.fn()} show={true} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it("hides dialog when no button is pressed", () => {
    const showFn = jest.fn();

    const { getByText } = render(<DeleteModal setShow={showFn} show={true} />);

    fireEvent.click(getByText("No"));

    expect(showFn).toBeCalledWith(false);
  });

  it("deletes user when yes button is pressed", async () => {
    authenticatedDelete(deleteEndPoint, inDateNonAdminToken, { status: 204 });

    const showFn = jest.fn();

    const { getByText } = render(<DeleteModal setShow={showFn} show={true} />);

    fireEvent.click(getByText("Yes"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).toBeCalledWith("/");
    expect(showFn).toBeCalledWith(false);
    expect(fetcher.hasToken()).toBeFalsy();
  });

  it("displays an error when delete throws", async () => {
    authenticatedDelete(deleteEndPoint, inDateNonAdminToken, {
      throws: new Error()
    });

    const showFn = jest.fn();

    const { getByText, baseElement } = render(
      <DeleteModal setShow={showFn} show={true} />
    );

    fireEvent.click(getByText("Yes"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).not.toBeCalledWith("/");
    expect(showFn).not.toBeCalledWith(false);

    expect(baseElement).toMatchSnapshot();
  });

  it("displays an error when delete returns error", async () => {
    authenticatedDelete(deleteEndPoint, inDateNonAdminToken, { status: 401 });

    const showFn = jest.fn();

    const { getByText, baseElement } = render(
      <DeleteModal setShow={showFn} show={true} />
    );

    fireEvent.click(getByText("Yes"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(history.push).not.toBeCalledWith("/");
    expect(showFn).not.toBeCalledWith(false);
    expect(baseElement).toMatchSnapshot();
  });
});
