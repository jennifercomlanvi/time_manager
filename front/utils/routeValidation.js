export const useRouteValidation = (to) => {
  const { PUBLIC, CONNECTED, CONTROLED } = useScope();
  const authTokenStore = useAuthTokenStore();
  const router = useRouter();
  let route = null;

  const justRegistered = authTokenStore.justRegistered;

  // Not in control state
  if (!authTokenStore.isConnected || authTokenStore.isControled) {
    switch (to.meta.auth) {
      case PUBLIC:
        if (authTokenStore.isConnected) {
          route = { name: "index" };
        }
        break;
      case CONNECTED:
        if (authTokenStore.isControled) {
          route = { name: "dashboard" };
        } else if (!authTokenStore.isConnected) {
          route = { name: "login", query: { redirect: to.fullPath } };
        }
        break;
      case CONTROLED:
        if (!authTokenStore.isControled) {
          route = { name: "login", query: { redirect: to.fullPath } };
        }
        break;
      default:
        break;
    }
  } else if (to.name !== "control") {
    // route = { name: "control", query: { redirect: to.fullPath } };
    if (justRegistered) {
      route = { name: "team" };
      authTokenStore.justRegistered = false; // Reset the registration flag
    } else {
      route = { name: "dashboard" };
    }
  }

  // Can't have a route with ?redirect=/control
  if (route?.query?.redirect) {
    const redirect = router.resolve(route.query.redirect);
    if (redirect.name === "control") {
      delete route.query.redirect;
    }
  }

  return route;
};
