import { inDateAdminToken, inDateNonAdminToken } from "./_testSupport/tokens";
import { Fetcher } from "./fetcher";

describe("Authenticated Fetcher", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("automatically loads a token from storage when constructed", () => {
    localStorage.setItem("token", inDateNonAdminToken);

    const fetcher = new Fetcher();

    expect(fetcher.hasToken()).toBeTruthy();
    expect(fetcher.getName()).toBe("Test User");
    expect(fetcher.isAdmin()).toBeFalsy();
    expect(fetcher.isInDate()).toBeTruthy();
  });

  it("handles not having a token in storage when constructed", () => {
    const fetcher = new Fetcher();

    expect(fetcher.hasToken()).toBeFalsy();
    expect(fetcher.getName()).toBe("");
    expect(fetcher.isAdmin()).toBeFalsy();
    expect(fetcher.isInDate()).toBeFalsy();
  });

  it("handles having an invalid token in storage when constructed", () => {
    localStorage.setItem("token", "badToken");

    const fetcher = new Fetcher();

    expect(fetcher.hasToken()).toBeFalsy();
    expect(fetcher.getName()).toBe("");
    expect(fetcher.isAdmin()).toBeFalsy();
    expect(fetcher.isInDate()).toBeFalsy();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("updates token when saveToken is called", () => {
    const fetcher = new Fetcher();
    fetcher.saveToken(inDateNonAdminToken);

    expect(fetcher.hasToken()).toBeTruthy();
    expect(fetcher.getName()).toBe("Test User");
    expect(fetcher.isAdmin()).toBeFalsy();
    expect(fetcher.isInDate()).toBeTruthy();

    fetcher.saveToken(inDateAdminToken);

    expect(fetcher.hasToken()).toBeTruthy();
    expect(fetcher.getName()).toBe("Test User");
    expect(fetcher.isAdmin()).toBeTruthy();
    expect(fetcher.isInDate()).toBeTruthy();
  });

  it("calls name change handler with new token", () => {
    const mock = jest.fn();

    const fetcher = new Fetcher();
    fetcher.setNameChangeHandler(mock);
    fetcher.saveToken(inDateNonAdminToken);

    expect(mock).toBeCalledWith("Test User");
  });

  it("calls name change handler with new name", () => {
    const mock = jest.fn();

    const fetcher = new Fetcher();
    fetcher.saveToken(inDateNonAdminToken);
    fetcher.setNameChangeHandler(mock);
    fetcher.updateName("New Name");

    expect(mock).toBeCalledWith("New Name");
  });

  it("clears token if an invalid one is passed", () => {
    const fetcher = new Fetcher();
    fetcher.saveToken(inDateNonAdminToken);
    expect(fetcher.hasToken()).toBeTruthy();

    fetcher.saveToken("BadToken");
    expect(fetcher.hasToken()).toBeFalsy();
    expect(fetcher.isInDate()).toBeFalsy();
  });

  it("clears token if clearToken is called", () => {
    const fetcher = new Fetcher();
    fetcher.saveToken(inDateNonAdminToken);
    expect(fetcher.hasToken()).toBeTruthy();

    fetcher.clearToken();
    expect(fetcher.hasToken()).toBeFalsy();
    expect(fetcher.isInDate()).toBeFalsy();
  });

  it("throws if an authenticated request is made without a token", () => {
    const fetcher = new Fetcher();
    expect(() => fetcher.authFetch("/test/uri")).toThrow("No token");
  });
});
