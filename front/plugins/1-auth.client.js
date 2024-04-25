import HttpException from "../models/exception/HttpException";
import useResponseBody from "../composables/api/responseBody";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authTokenStore = useAuthTokenStore(nuxtApp.$pinia);
  const httpStore = useHttpStore(nuxtApp.$pinia);

  function login() {
    httpStore.setAuthPending(httpStore.SYNC);

    const dataAccess = useLocaleStorage.get("access");
    const dataRefresh = useLocaleStorage.get("refresh");

    const timestamp = Date.now();
    const hasAccess = dataAccess?.token && dataAccess.exp > timestamp;
    const hasRefresh = dataRefresh?.token && dataRefresh.exp > timestamp;

    if (hasAccess || hasRefresh) {
      let url = null;
      const init = {
        method: "GET",
        headers: {},
      };
      if (hasAccess) {
        url = `${import.meta.env.VITE_API_URL}api/v1/renew${hasRefresh ? `?token=${dataRefresh.token}` : ""}`;
        init.headers.Authorization = `Bearer ${dataAccess.token}`;
      } else {
        url = `${import.meta.env.VITE_API_URL}api/v1/refresh?token=${dataRefresh.token}`;
      }

      fetch(url, init)
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
        .then((res) => {
          authTokenStore.setToken(res);
          httpStore.setAuthPending(httpStore.NONE);
          httpStore.launchApiQueue();

          const route = useRoute();

          let to = null;

          // repasser dessus
          if (!authTokenStore.isControled) {
            // Redirect to user control
            to = { name: "control", query: { redirect: route.query.redirect } };
          } else if (route.query.redirect) {
            // Redirect to the redirect URL
            to = route.query.redirect;
          } else {
            // Check the route access (redirect if wrong privilege)
            to = useRouteValidation(route);
          }

          if (to) {
            return navigateTo(to, { replace: true });
          }
        })
        // eslint-disable-next-line consistent-return
        .catch(() => {
          // Delete access/refresh token
          useLocaleStorage.remove("access");
          if (hasAccess) {
            return login();
          }
          useLocaleStorage.remove("refresh");
          httpStore.setAuthPending(httpStore.NONE);
          httpStore.launchApiQueue();
        });
    } else {
      // Delete access/refresh token
      useLocaleStorage.remove("access");
      useLocaleStorage.remove("refresh");
      httpStore.setAuthPending(httpStore.NONE);
      httpStore.launchApiQueue();
    }
  }

  login();
});
