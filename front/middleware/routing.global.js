// eslint-disable-next-line consistent-return
export default defineNuxtRouteMiddleware(async (to) => {
    // TODO CLOSE DIALOG
    const route = useRouteValidation(to);
    // if (process.client && !navigator.onLine) {
    //   // TODO TEST CACHE
    //   throw createError({
    //     statusCode: 404, statusMessage: 'Offline', fatal: true, data: { offline: true },
    //   });
    // }
    if (route) {
      return navigateTo(route);
    }
  });
