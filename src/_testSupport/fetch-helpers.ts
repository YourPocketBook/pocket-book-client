import fetchMock, {
  MockOptionsMethodDelete,
  MockOptionsMethodGet,
  MockOptionsMethodPost,
  MockOptionsMethodPut,
  MockResponse,
  MockResponseFunction
} from "fetch-mock";

afterEach(fetchMock.reset);

export function authenticatedGet(
  url: string,
  token: string,
  response: MockResponse | MockResponseFunction,
  options?: MockOptionsMethodGet
) {
  fetchMock.get(
    (u, h) =>
      u === url &&
      (h.headers as { Authorization: string }).Authorization ===
        `Bearer ${token}`,
    response,
    options
  );
}

export function authenticatedPut(
  url: string,
  token: string,
  body: {},
  response: MockResponse | MockResponseFunction,
  options?: MockOptionsMethodPut
) {
  fetchMock.put(
    (u, h) =>
      u === url &&
      (h.headers as { Authorization: string }).Authorization ===
        `Bearer ${token}` &&
      h.body === JSON.stringify(body),
    response,
    options
  );
}

export function authenticatedPost(
  url: string,
  token: string,
  body: {},
  response: MockResponse | MockResponseFunction,
  options?: MockOptionsMethodPost
) {
  fetchMock.post(
    (u, h) =>
      u === url &&
      (h.headers as { Authorization: string }).Authorization ===
        `Bearer ${token}` &&
      h.body === JSON.stringify(body),
    response,
    options
  );
}

export function authenticatedDelete(
  url: string,
  token: string,
  response: MockResponse | MockResponseFunction,
  options?: MockOptionsMethodDelete
) {
  fetchMock.delete(
    (u, h) =>
      u === url &&
      (h.headers as { Authorization: string }).Authorization ===
        `Bearer ${token}`,
    response,
    options
  );
}
