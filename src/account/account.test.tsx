import "@testing-library/jest-dom/extend-expect";
import { act, fireEvent, render, wait } from "@testing-library/react";
import fetchMock from "fetch-mock";
import React from "react";
import ReactDOM from "react-dom";
import { Account } from ".";
import {
  authenticatedGet,
  authenticatedPut
} from "../_testSupport/fetch-helpers";
import { inDateNonAdminToken } from "../_testSupport/tokens";
import { fetcher } from "../fetcher";
import { history } from "../history";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

jest.mock("../hooks/useOnlineStatus");

const getEmailSettingsEndPoint = "/api/get-email-settings";
const setEmailSettingsEndPoint = "/api/update-email-settings";

describe("Account Page", () => {
  beforeAll(() => {
    fetcher.saveToken(inDateNonAdminToken);
  });

  beforeEach(() => {
    history.push = jest.fn();
    (useOnlineStatus as jest.Mock).mockReturnValue(true);
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(<Account />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders correctly", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: true
    });

    const { container } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(container).toMatchSnapshot();
  });

  it("displays correct email consent given correctly", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: true
    });

    const { getByText } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Disable Update Emails")).toBeInTheDocument();
  });

  it("displays correct email consent not given correctly", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: false
    });

    const { getByText } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Enable Update Emails")).toBeInTheDocument();
  });

  it("displays correct email consent given correctly when offline", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: true
    });

    const { getByText, rerender } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    act(() => {
      (useOnlineStatus as jest.Mock).mockReturnValue(false);
    });

    rerender(<Account />);

    expect(getByText("Disable Update Emails")).toBeDisabled();
  });

  it("displays correct email consent not given correctly when offline", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: false
    });

    const { getByText, rerender } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    act(() => {
      (useOnlineStatus as jest.Mock).mockReturnValue(false);
    });

    rerender(<Account />);

    expect(getByText("Enable Update Emails")).toBeDisabled();
  });

  it("hides email consent button when network fails", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      throws: new Error()
    });

    const { queryByText } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(queryByText("Enable Update Emails")).toBeNull();
    expect(queryByText("Disable Update Emails")).toBeNull();
  });

  it("hides email consent button when network returns failure", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      status: 401
    });

    const { queryByText } = render(<Account />);

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(queryByText("Enable Update Emails")).toBeNull();
    expect(queryByText("Disable Update Emails")).toBeNull();
  });

  it("removes email consent when clicked", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: true
    });
    authenticatedPut(
      setEmailSettingsEndPoint,
      inDateNonAdminToken,
      { updateEmailConsentGiven: false },
      { status: 204 }
    );

    const { getByText } = render(<Account />);

    await wait(() =>
      expect(fetchMock.done(getEmailSettingsEndPoint)).toBeTruthy()
    );

    fireEvent.click(getByText("Disable Update Emails"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());
  });

  it("grants email consent when clicked", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      body: { updateEmailConsentGiven: false }
    });
    authenticatedPut(
      setEmailSettingsEndPoint,
      inDateNonAdminToken,
      { updateEmailConsentGiven: true },
      { status: 204 }
    );

    const { getByText } = render(<Account />);

    await wait(() =>
      expect(fetchMock.done(getEmailSettingsEndPoint)).toBeTruthy()
    );

    fireEvent.click(getByText("Enable Update Emails"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Disable Update Emails")).toBeInTheDocument();
  });

  it("handles email consent throwing properly", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: false
    });
    authenticatedPut(
      setEmailSettingsEndPoint,
      inDateNonAdminToken,
      { updateEmailConsentGiven: true },
      { throws: new Error() }
    );

    const { getByText } = render(<Account />);

    await wait(() =>
      expect(fetchMock.done(getEmailSettingsEndPoint)).toBeTruthy()
    );

    fireEvent.click(getByText("Enable Update Emails"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Enable Update Emails")).toBeInTheDocument();
  });

  it("handles email consent failing properly", async () => {
    authenticatedGet(getEmailSettingsEndPoint, inDateNonAdminToken, {
      updateEmailConsentGiven: false
    });
    authenticatedPut(
      setEmailSettingsEndPoint,
      inDateNonAdminToken,
      { updateEmailConsentGiven: true },
      { status: 401 }
    );

    const { getByText } = render(<Account />);

    await wait(() =>
      expect(fetchMock.done(getEmailSettingsEndPoint)).toBeTruthy()
    );

    fireEvent.click(getByText("Enable Update Emails"));

    await wait(() => expect(fetchMock.done()).toBeTruthy());

    expect(getByText("Enable Update Emails")).toBeInTheDocument();
  });
});
