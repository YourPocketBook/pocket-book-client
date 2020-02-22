import {
  AuthError,
  AuthResponse,
  Configuration,
  UserAgentApplication
} from "msal";
import { fetcher } from "./fetcher";
import { history } from "./history";

const sjaAuthority = "91d037fb-4714-4fe8-b084-68c083b8193f";

const config: Configuration = {
  auth: {
    authority: `https://login.microsoftonline.com/${sjaAuthority}`,
    clientId: "6a5d659f-f29d-4f37-9a72-0378ae55bd6b",
    navigateToLoginRequestUrl: false
  },
  cache: {
    cacheLocation: "localStorage"
  }
};

const userAgentApplication = new UserAgentApplication(config);
userAgentApplication.handleRedirectCallback(authCallback);

function authCallback(authErr: AuthError, response?: AuthResponse) {
  if (!authErr) {
    if (
      response?.tokenType === "id_token" &&
      userAgentApplication.getAccount() &&
      response.tenantId === sjaAuthority
    ) {
      fetcher.saveToken(response.idToken.rawIdToken);
      history.push("/home");
      return;
    }
  }

  fetcher.clearToken();
  history.push("/login-error");
}

export function login() {
  const loginRequest = {
    scopes: ["https://graph.microsoft.com/User.Read"]
  };

  userAgentApplication.loginRedirect(loginRequest);
}

export function logout() {
  userAgentApplication.logout();
}
