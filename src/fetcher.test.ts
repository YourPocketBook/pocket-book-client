import { Fetcher } from "./fetcher";
import { getToken, login, userAgentApplication } from "./ms-login";

jest.mock("./ms-login");

describe("Authenticated Fetcher", () => {
  it("redirects to login if an authenticated request is made without a token", async () => {
    (getToken as jest.Mock).mockResolvedValue("");

    const fetcher = new Fetcher();
    try {
      await fetcher.authFetch("/test/uri");
      fail();
    }
    catch (error) {
      expect(error).toEqual("No token");
      expect(login).toBeCalled();
    }
  });

  it("returns the user's name from MSAL when getName is called", () => {
    const fetcher = new Fetcher();
    const userName = "Test User";

    (userAgentApplication.getAccount as jest.Mock).mockReturnValue({
      name: userName
    });

    const actual = fetcher.getName();

    expect(actual).toEqual(userName);
  });
});
