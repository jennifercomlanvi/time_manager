// WRAPPER ----------------------------------------------------------------------------------------

import HttpException from "../models/exception/HttpException";
import useTokenStatus from "./api/token";
import useResponseBody from "./api/responseBody";

/**
 * Wrapper de l'API Fetch
 * @param {string} url
 * @param {object} options
 * @returns {Promise<any>}
 */
const useApi = async (url, options = {}) => {
  const authTokenStore = useAuthTokenStore();
  const httpStore = useHttpStore();
  const { PENDING } = useStatus();

  // Auth pending ---------------------------------------------------------------------------------
  if ((await useTokenStatus()) === PENDING) {
    // Add api to pending queue  ------------------------------------------------------------------
    return new Promise((resolve, reject) => {
      httpStore.addApiQueue({
        promise: () => useApi(url, options),
        resolve,
        reject,
      });
    });
  }

  // Build url ------------------------------------------------------------------------------------
  const input = new URL(url, import.meta.env.VITE_API_URL);

  const headers = options.headers || {};
  if (authTokenStore.apiToken.access) {
    headers.Authorization = `Bearer ${authTokenStore.apiToken.access}`;
  }

  // Build request init -------------------------------------------------------------------------
  const init = {
    method: options.method,
    headers,
    signal: options.signal ?? null,
  };

  // add Query || body --------------------------------------------------------------------------
  if (options.query) {
    Object.keys(options.query).forEach((key) => {
      let data = unref(options.query[key]);
      if (Array.isArray(data)) {
        data = JSON.stringify(data);
      }
      input.searchParams.append(key, data);
    });
  }

  if (options.json) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.json);
  } else if (options.form) {
    init.body = new FormData();
    Object.keys(options.form).forEach((key) =>
      init.body.append(key, unref(options.form[key])),
    );
  }

  return (
    fetch(input, init)
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
      // handle error
      .catch(async (e) => {
        switch (e.status) {
          case 401:
            authTokenStore.refresh();
            if (
              authTokenStore.refreshToken.access &&
              authTokenStore.refreshToken.exp > Date.now()
            ) {
              return useApi(url, options);
            }
            await authTokenStore.logout();
            break;
          case 403:
            if (e.code === "default") {
              await authTokenStore.logout();
            }
            break;
          case 500:
            // TODO DIALOG ERROR
            break;
          default:
            break;
        }
        throw e;
      })
  );
};

// HELPERS ----------------------------------------------------------------------------------------

const httpGet = async (url, data = null, options = {}) => {
  options.method = "GET";
  options.query = data;
  return useApi(url, options);
};

const httpDelete = async (url, data = null, options = {}) => {
  options.method = "DELETE";
  options.query = data;
  return useApi(url, options);
};

const httpPost = async (url, data = null, options = {}) => {
  options.method = "POST";
  options.json = data;
  return useApi(url, options);
};

const httpPut = async (url, data = null, options = {}) => {
  options.method = "PUT";
  options.json = data;
  return useApi(url, options);
};

const httpPatch = async (url, data = null, options = {}) => {
  options.method = "PATCH";
  options.json = data;
  return useApi(url, options);
};

const httpForm = async (url, data = null, options = {}) => {
  options.method = "POST";
  options.form = data;
  return useApi(url, options);
};

export const useHttp = {
  get: (url, data = null, options = {}) => httpGet(url, data, options),
  delete: (url, data = null, options = {}) => httpDelete(url, data, options),
  post: (url, data = null, options = {}) => httpPost(url, data, options),
  put: (url, data = null, options = {}) => httpPut(url, data, options),
  patch: (url, data = null, options = {}) => httpPatch(url, data, options),
  form: (url, data = null, options = {}) => httpForm(url, data, options),
};
