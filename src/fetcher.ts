import isFuture from "date-fns/isFuture";
import jwtDecode from "jwt-decode";

class Fetcher {
  private realName: string = "";
  private nameChanged?: (name: string) => void;
  private token: string | null;
  private parsedToken:
    | { exp: number; given_name: string; role: string }
    | undefined;

  constructor() {
    this.token = localStorage.getItem("token");
    this.parseToken();
  }

  public setNameChangeHandler(func?: (name: string) => void) {
    this.nameChanged = func;
  }

  public authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    if (!this.token) {
      throw new Error("No token");
    }

    init = {
      ...init,
      headers: {
        ...(init ? init.headers : {}),
        Authorization: `Bearer ${this.token}`
      }
    };

    return fetch(input, init);
  }

  public saveToken(token: string) {
    localStorage.setItem("token", token);
    this.token = token;
    this.parseToken();
  }

  public checkToken(token: string): boolean {
    return this.token === token;
  }

  public clearToken() {
    localStorage.removeItem("token");
    this.token = null;
    this.parsedToken = undefined;
  }

  public getName() {
    return this.realName;
  }

  public updateName(name: string) {
    this.realName = name;
    if (this.nameChanged) {
      this.nameChanged(name);
    }
  }

  public isAdmin() {
    if (this.parsedToken) {
      return this.parsedToken.role === "Admin";
    }
    return false;
  }

  public hasToken(): boolean {
    return !!this.token;
  }

  public isInDate() {
    if (this.parsedToken) {
      return isFuture(this.parsedToken.exp * 1000);
    }

    return false;
  }

  private parseToken() {
    if (this.token) {
      try {
        this.parsedToken = jwtDecode(this.token);
      } catch {
        this.token = null;
        this.updateName("");
        localStorage.removeItem("token");
        this.parsedToken = undefined;
      }

      if (this.parsedToken) {
        this.updateName(this.parsedToken.given_name);
      }
    } else {
      this.parsedToken = undefined;
      this.updateName("");
    }
  }
}

const fetcher = new Fetcher();

export { fetcher, Fetcher };
