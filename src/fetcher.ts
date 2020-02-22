import { getToken, login, userAgentApplication } from "./ms-login";
import { toDate, isFuture } from "date-fns";

class Fetcher {
  public async authFetch(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const token = await getToken();

    if (!token) {
      login();
      return Promise.reject("No token");
    }

    init = {
      ...init,
      headers: {
        ...(init ? init.headers : {}),
        Authorization: `Bearer ${token}`
      }
    };

    return fetch(input, init);
  }

  public getName() {
    const userAccount = userAgentApplication.getAccount();

    if (!userAccount) {
      return "";
    }
    return userAccount.name;
  }

  public hasToken(): boolean {
    return !!userAgentApplication.getAccount();
  }

  public isInDate() {
    const userAccount = userAgentApplication.getAccount();

    return (
      !!userAccount &&
      isFuture(toDate(parseInt(userAccount.idTokenClaims.exp, 10) * 1000))
    );
  }
}

const fetcher = new Fetcher();

export { fetcher, Fetcher };
