export default defineNuxtRouteMiddleware((to) => {
  const { PUBLIC, CONNECTED, CONTROLED } = useScope();

  const session = useAuthTokenStore();

  if (to.meta.auth === CONTROLED && session.authLevel !== CONTROLED) {
    return navigateTo({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  }
  if (session.authLevel === CONNECTED && to.name !== "control") {
    return navigateTo({
      path: "/control",
      query: { redirect: to.fullPath },
    });
  }
});
