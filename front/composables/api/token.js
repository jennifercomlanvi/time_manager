import HttpException from "../../models/exception/HttpException";

function fetchToken() {
  const httpStore = useHttpStore();
  const authTokenStore = useAuthTokenStore();
  const { ERROR, DONE } = useStatus();

  const renew = httpStore.authPending === httpStore.ASYNC;
  const hasRefresh =
    authTokenStore.refreshToken.access &&
    authTokenStore.refreshToken.exp > Date.now();

  let url = null;
  const init = {
    method: "GET",
    headers: {},
  };
  if (renew) {
    url = `${import.meta.env.VITE_API_URL}api/v1/renew${hasRefresh ? `?token=${authTokenStore.refreshToken.access}` : ""}`;
    init.headers.Authorization = `Bearer ${authTokenStore.apiToken.access}`;
  } else {
    url = `${import.meta.env.VITE_API_URL}api/v1/refresh?token=${authTokenStore.refreshToken.access}`;
  }

  return fetch(url, init)
    .then(async (res) => {
      const body = await useResponseBody(res);
      if (res.ok) {
        return body;
      }
      throw new HttpException({
        status: res.status,
        data: body,
      });
    })
    .then(async (res) => {
      // Nothing happen if the user control is created after the login/refresh
      // If the user has user control on login/refresh but don't after renew the user auth level is updated
      if (renew && res.has_control && authTokenStore.isControled) {
        res.has_control = false;
      }
      authTokenStore.setToken(res);
      httpStore.setAuthPending(httpStore.NONE);
      httpStore.launchApiQueue();

      return DONE;
    })
    .catch(async () => {
      if (
        renew &&
        authTokenStore.refreshToken.access &&
        authTokenStore.refreshToken.exp > Date.now()
      ) {
        httpStore.setAuthPending(httpStore.SYNC);
        return fetchToken();
      }
      await authTokenStore.logout();
      httpStore.setAuthPending(httpStore.NONE);
      httpStore.launchApiQueue();
      return ERROR;
    });
}

/**
 * Vérifie si le token est valide, sinon en récupère un nouveau
 * @returns {integer} [0,1,2] => [ERROR,PENDING,DONE]
 */
const useTokenStatus = async () => {
  // Renew async every 15 min (access 1 hour)
  const ASYNC_REFRESH_DELAY = 1000 * 60 * 45;

  const httpStore = useHttpStore();
  const authTokenStore = useAuthTokenStore();
  const { ERROR, PENDING, DONE } = useStatus();

  // authentification/refresh en cours
  if (httpStore.authPending === httpStore.SYNC) {
    return PENDING;
  }

  const timestamp = Date.now();

  // not connected or access expire in more than 45 min
  if (
    !authTokenStore.isConnected ||
    authTokenStore.apiToken.exp > timestamp + ASYNC_REFRESH_DELAY
  ) {
    return DONE;
  }

  // expire in less than 45 min => renew async (every 15 min)
  if (authTokenStore.apiToken.exp > timestamp) {
    if (httpStore.authPending === httpStore.NONE) {
      httpStore.setAuthPending(httpStore.ASYNC);
      fetchToken();
    }
    return DONE;
  }

  // expired => refresh sync
  if (
    authTokenStore.refreshToken.access &&
    authTokenStore.refreshToken.exp > timestamp
  ) {
    const currentPending = unref(httpStore.authPending);
    httpStore.setAuthPending(httpStore.SYNC);
    return currentPending === httpStore.NONE ? fetchToken() : PENDING;
  }

  // can't refresh
  await authTokenStore.logout();
  httpStore.launchApiQueue();
  return ERROR;
};

export default useTokenStatus;
