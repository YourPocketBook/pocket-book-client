import { Key, pathToRegexp } from "path-to-regexp";

export class StatusError extends Error {
  public status = 0;
}

function matchURI(path: string, uri: string) {
  const keys: Key[] = [];
  const pattern = pathToRegexp(path, keys); // TODO: Use caching
  const match = pattern.exec(uri);
  if (!match) {
    return null;
  }
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] = match[i] !== undefined ? match[i] : undefined;
  }
  return params;
}

function parseQuery(queryString: string) {
  const query: { [index: string]: string } = {};
  const pairs = (queryString[0] === "?"
    ? queryString.substr(1)
    : queryString
  ).split("&");
  for (const pair of pairs) {
    const items = pair.split("=");
    query[decodeURIComponent(items[0])] = decodeURIComponent(items[1] || "");
  }
  return query;
}

export interface IRoute {
  path: string;
  action: (params: any) => React.ReactNode;
}

export async function resolve(
  routes: IRoute[],
  context: { error?: string; pathname: string; search: string }
) {
  for (const route of routes) {
    const uri = context.error ? "/error" : context.pathname;
    const params = matchURI(route.path, uri);
    if (!params) {
      continue;
    }

    const queryParams = parseQuery(context.search);

    const result = route.action({ ...context, params, ...queryParams });
    if (result) {
      return result;
    }
  }

  const error = new StatusError("Not found");
  error.status = 404;

  throw error;
}
