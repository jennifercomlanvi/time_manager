export default defineNuxtRouteMiddleware((to, from) => {
    const session = useAuthTokenStore();

    if (!session.token) {
        return navigateTo({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
});
