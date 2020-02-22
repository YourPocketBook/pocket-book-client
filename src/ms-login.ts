import {
  AuthenticationParameters,
  AuthError,
  AuthResponse,
  Configuration,
  UserAgentApplication
} from "msal";
import { history } from "./history";

const sjaAuthority = "91d037fb-4714-4fe8-b084-68c083b8193f";

const config: Configuration = {
  auth: {
    authority: `https://login.microsoftonline.com/${sjaAuthority}`,
    clientId: "6a5d659f-f29d-4f37-9a72-0378ae55bd6b",
    navigateToLoginRequestUrl: false,
    postLogoutRedirectUri: "https://localhost:3000",
    redirectUri: "https://localhost:3000/"
  },
  cache: {
    cacheLocation: "localStorage"
  }
};

export const userAgentApplication = new UserAgentApplication(config);
userAgentApplication.handleRedirectCallback(authCallback);

export async function getToken() {
  const accessTokenRequest: AuthenticationParameters = {
    redirectUri: "https://localhost:3000/",
    scopes: ["user.read"]
  };

  try {
    const res = await userAgentApplication.acquireTokenSilent(
      accessTokenRequest
    );

    return res.idToken.rawIdToken;
  } catch (error) {
    return "";
  }
}

function authCallback(authErr: AuthError, response?: AuthResponse) {
  if (!authErr) {
    if (
      response?.tokenType === "id_token" &&
      userAgentApplication.getAccount() &&
      response.tenantId === sjaAuthority
    ) {
      history.push("/home");
      return;
    }
  }

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
